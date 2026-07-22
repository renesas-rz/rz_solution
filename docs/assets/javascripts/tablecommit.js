document$.subscribe(function() {
  async function createGitPatchLink(el) {
    const fileName = el.textContent + ".patch"
    const patchUrl = "https://github.com/renesas-rz/meta-renesas/commit/" + fileName

    const icon = document.createElement('span');
    icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.944 11h4.306a.75.75 0 0 1 0 1.5h-4.306a5.001 5.001 0 0 1-9.888 0H2.75a.75.75 0 0 1 0-1.5h4.306a5.001 5.001 0 0 1 9.888 0m-1.444.75a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0"></path></svg>';
    icon.classList.add("twemoji");

    const link = document.createElement('a');
    link.href = patchUrl;
    link.download = fileName;
    link.target = "_blank";
    link.appendChild(icon);

    const commit = document.createElement('code');
    commit.innerHTML = el.textContent;

    el.textContent = "";
    el.appendChild(commit);
    el.appendChild(link);
  }

  async function createTooltip(el, tooltip) {
    el.setAttribute('data-tooltip', tooltip);
    el.classList.add('table_tootlip');
  }

  async function setColumnWidth(el) {
    el.closest('.table-commit').style.maxWidth = "fit-content";
    el.closest('.md-typeset__scrollwrap').style.maxWidth = "fit-content";
  }

  const table_titles = document.querySelectorAll(".table-commit .admonition-title");
  table_titles.forEach(title => {
    const parameters = title.textContent.split('&');
    // commit=2&issued=5&update=6
    let commit_area = '';
    let issued_date = '';
    let update_date = '';
    parameters.forEach(parameter => {
      const key_val = parameter.split('=');
      if (key_val.at(0) === 'commit')
        commit_area = key_val.at(1)
      else if (key_val.at(0) === 'issued')
        issued_date = key_val.at(1)
      else if (key_val.at(0) === 'update')
        update_date = key_val.at(1)
    });

    const tables = document.querySelectorAll(".table-commit table");
    tables.forEach(async table => {
      await setColumnWidth(table);
    });

    const commits = document.querySelectorAll(".table-commit table tbody tr td:nth-child(" + commit_area + ")");
    commits.forEach(async commit => {
      await createGitPatchLink(commit);
    });

    const tooltip_issued_date = "Issued Date: The date on which the advisory was initially published and added to this table.";
    const issued_dates = document.querySelectorAll(".table-commit table thead tr th:nth-child(" + issued_date + ")");
    issued_dates.forEach(async _issued_date => {
      await createTooltip(_issued_date, tooltip_issued_date);
    });

    const tooltip_udpate_date = "Update Date: The date on which the advisory was last modified or updated.";
    const update_dates = document.querySelectorAll(".table-commit table thead tr th:nth-child(" + update_date + ")");
    update_dates.forEach(async _update_date => {
      await createTooltip(_update_date, tooltip_udpate_date);
    });
  });
})
