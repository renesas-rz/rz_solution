#!/usr/bin/python3

import os

pwd = os.getcwd()

def on_post_build(config, **kwargs):
    if (config['extra'].get('pagefind_search')):
        this_site = config['repo_name']
        local_link = config['extra']['pagefind_search']['metadata']['local_link']
        outside_link = config['extra']['pagefind_search']['metadata']['outside_link']
        generate_metadata(this_site, local_link, outside_link, config['site_dir'])

# ------------------------------------------------------------------------------

def do_subprocess(command):
    import subprocess

    res = subprocess.run(
        command,
        shell=True,          # Required for shell features like pipes (|)
        capture_output=True, # Captures stdout/stderr
        text=True,           # Returns data as strings instead of bytes
        check=True           # Throws an exception if the pipeline fails
    )

    return res

def is_latest_exist(target):
    from pathlib import Path

    target_dir = Path(target)
    symlink_path = target_dir / "latest"

    if symlink_path.is_symlink():
        return True
    else:
        return False

def list_and_sort_dir(target):
    dirs = sorted([d for d in os.listdir(target) if os.path.isdir(os.path.join(target, d)) and d != '.git' and d != 'latest'], reverse=True)
    return dirs

def do_weighting(target):
    weight = 10
    if is_latest_exist(target):
        dirs = list_and_sort_dir(target)
        step = 2.5
        for dir in dirs:
            command = "grep -rlZ 'data-pagefind-body' " + target + "/" + dir + " | xargs -0 sed -i " \
                      "'s/data-pagefind-body/data-pagefind-body data-pagefind-weight=\"" + str(round(weight,1)) + "\"/g'"
            do_subprocess(command)
            if (weight - step) <= 0:
                if weight > 1:
                    step = 1.5
                else:
                    step = 0.1
            weight = weight - step if weight - step > 0.1 else 0.1
    else:
        command = "grep -rlZ 'data-pagefind-body' " + target + " | xargs -0 sed -i " \
                  "'s/data-pagefind-body/data-pagefind-body data-pagefind-weight=\"" + str(round(weight,1)) + "\"/g'"
        do_subprocess(command)

def do_pagefind(target, exclude_files):
    command = ""
    if "rzv_ai_sdk" not in target:
        # limiting to content only
        minify = "grep -rlZ 'data-md-component=content' " + target + " | xargs -0"
        _minify = int(len(do_subprocess(minify).stdout))

        normal = "grep -rlZ 'data-md-component=\"content\"' " + target + " | xargs -0"
        _normal = int(len(do_subprocess(normal).stdout))

        if _minify > _normal:
            command = "grep -rlZ 'data-md-component=content' " + target + " | xargs -0 sed -i " \
                      "'s/data-md-component=content/data-md-component=content data-pagefind-body/g'"
        else:
            command = "grep -rlZ 'data-md-component=\"content\"' " + target + " | xargs -0 sed -i " \
                      "'s/data-md-component=\"content\"/data-md-component=\"content\" data-pagefind-body/g'"
    else:
        command = "grep -rlZ 'section' " + target + " | xargs -0 sed -i " \
                  "'s/section/section data-pagefind-body/g'"
    do_subprocess(command)

    # exclude
    for exclude in exclude_files:
        command = "find " + target + " -type f -path \"*" + exclude + "*\" -exec sed -i " \
                  "'s/data-pagefind-body/data-pagefind-ignore=all/g' {} +"
        do_subprocess(command)

    do_weighting(target)

    command = "work/pagefind --source " + target
    do_subprocess(command)

def pagefine_excludes():
    return [
        # all
        "404.html", "_components", "guidelines",
        # ai sdk
        "eSD_format_sd.html", "RZV2L_board_setup_e2studio.html", "version.html"
    ]

# ------------------------------------------------------------------------------

def git_clone(repo_url, out_path):
    res = True
    try:
        do_subprocess("git clone --branch gh-pages --depth 1 " + repo_url + " " + out_path)
    except:
        do_subprocess("git clone --depth 1 " + repo_url + " " + out_path)
        res = False
    return res

def git_sync(out_path):
    res = True
    os.chdir(out_path)
    try:
        do_subprocess("git pull")
    except:
        res = False
    os.chdir(pwd)
    return res

def git_check_latest_commit(out_path):
    os.chdir(out_path)
    res = do_subprocess("git rev-parse HEAD").stdout.replace("\n","")
    os.chdir(pwd)
    return res

def git_cleanup(out_path):
    os.chdir(out_path)
    res = True
    try:
        do_subprocess("git stash && git stash drop")
    except:
        res = False
    os.chdir(pwd)
    return res

def git_branch_is_gh_pages(out_path):
    os.chdir(out_path)
    res = do_subprocess("git branch").stdout
    os.chdir(pwd)
    if "gh-pages" in res:
        return True
    else:
        return False

# ------------------------------------------------------------------------------

def do_build(out_path):
    os.chdir(out_path)
    req = "ls " + out_path + " | grep requirements.txt | wc -l"
    _req = int(do_subprocess(req).stdout)

    if _req > 0:
        do_subprocess("sed -i /^pre-commit.*/d requirements.txt")
        do_subprocess("pip install -r requirements.txt")

    do_subprocess("mkdocs build")
    os.chdir(pwd)

def do_tmp(is_move, out_path, tmp_area):
    if not os.path.isdir(tmp_area):
        do_subprocess("mkdir -p " + tmp_area)

    if is_move:
        os.rename(out_path + "/pagefind", tmp_area + "/pagefind")
    else:
        os.system("cp -a " + out_path + "/pagefind " + tmp_area + "/pagefind")

def check_tmp(tmp_area):
    res = True
    if not os.path.isdir(tmp_area):
        res = False
    return res

def do_deploy(tmp_area, deploy_area):
    os.system("cp -r " + tmp_area + "/pagefind " + deploy_area + "/pagefind")

# ------------------------------------------------------------------------------

def prepare(local_link, site_dir):
    if not os.path.isdir(pwd + "/tmp/"):
        do_subprocess("mkdir tmp/")

    if not os.path.isdir(pwd + "/tmp/" + local_link):
        do_subprocess("mkdir tmp/" + local_link)

    if not os.path.isdir(pwd + "/tmp/pagefinded/"):
        do_subprocess("mkdir tmp/pagefinded/")

    do_subprocess("mkdir " + site_dir + "/" + local_link)

def remove_dir(out_dir):
    import shutil
    shutil.rmtree(out_dir)

# ------------------------------------------------------------------------------

def generate_metadata(this_site, local_link, outside_link, site_dir):
    import logging
    import mkdocs.plugins
    log = logging.getLogger("mkdocs.plugins.pagefind_search")

    log.info("Pagefind - Generating Metadata!")

    # this site
    log.debug("`" + this_site + "` - Starting...")

    do_pagefind(site_dir, pagefine_excludes())
    do_pagefind(site_dir + "/knowledge_base", [])

    log.debug("`" + this_site + "` - Completed")

    # other sites (sub_sites)
    prepare(local_link, site_dir)
    for link in outside_link:
        do_fetch = False

        repo_url = (link['link'] + 'pagefind/').replace('https://renesas-rz.github.io/', 'https://github.com/renesas-rz/').replace('/pagefind/', '.git')
        repo_name = repo_url.replace('https://github.com/renesas-rz/', '').replace('.git', '')

        log.debug("`" + repo_name + "` - Starting...")

        do_subprocess("mkdir " + site_dir + "/" + local_link + repo_name)

        out_path = pwd + "/tmp/" + local_link + repo_name
        tmp_area = pwd + "/tmp/pagefinded/" + repo_name
        deploy_area = site_dir + "/" +  local_link + repo_name

        is_gh_pages = True
        if not os.path.isdir(out_path):
            log.debug("`" + repo_name + "` - Cloning...")
            git_clone(repo_url, out_path)
        else:
            do_fetch = True

        if do_fetch:
            log.debug("`" + repo_name + "` - Pulling...")
            if not git_sync(out_path):
                log.debug("`" + repo_name + "` - Cannot Pull, Remove...")
                remove_dir(out_path)
                log.debug("`" + repo_name + "` - Re-cloning...")
                git_clone(repo_url, out_path)

        # check current branch
        is_gh_pages = git_branch_is_gh_pages(out_path)

        log.debug("`" + repo_name + "` - Sync...")
        commit = git_check_latest_commit(out_path)
        tmp_area += "/" + commit

        if not check_tmp(tmp_area):
            if not is_gh_pages:
                log.debug("`" + repo_name + "` - Compiling...")
                do_build(out_path)
                log.debug("`" + repo_name + "` - Pagefinding...")
                do_pagefind(out_path + "/site", pagefine_excludes())
                git_cleanup(out_path)
                do_tmp(True, out_path + "/site", tmp_area)
            else:
                if os.path.isdir(out_path + "/pagefind"):
                    log.debug("`" + repo_name + "` - Pagefind Exist! Copying...")
                    do_tmp(False, out_path, tmp_area)
                else:
                    log.debug("`" + repo_name + "` - Pagefinding...")
                    do_pagefind(out_path, pagefine_excludes())
                    git_cleanup(out_path)
                    do_tmp(True, out_path, tmp_area)
        else:
            log.debug("`" + repo_name + "` - Temp Exist! Copying...")

        log.debug("`" + repo_name + "` - Deploying...")
        do_deploy(tmp_area, deploy_area)

        log.debug("`" + repo_name + "` - Completed")

    log.info("Pagefind Metadata Done")
