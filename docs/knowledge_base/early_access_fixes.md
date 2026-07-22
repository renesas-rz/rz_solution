---
inline_toc: true
---

# Early Access Fixes for VLP

!!! abstract "Page Information"
    Last updated: ***July 27, 2026***

{% if inline_toc %}
!!! content-wrapper no-indent inline-toc ""

    [TOC]
{% endif %}

Renesas actively provides fixes, security updates, and maintenance patches through the official GitHub repository for the RZ Family Yocto build layer[^1] included in the Verified Linux Package (VLP).

[^1]: RZ Family Yocto build layer repository is available at [meta-renesas](https://github.com/renesas-rz/meta-renesas.git){: target=_blank }.

For details of applicable fixes and advisories, refer to the table in the [Affected VLP Releases](#affected-vlp-releases) section below.

## Affected VLP Releases

=== "VLP v3.0"

    !!! note

        Repository branch name: `dunfell/rz` [:material-link:](https://github.com/renesas-rz/meta-renesas/tree/dunfell/rz){: target=_blank }.

        Tag naming convention: `BSP-3.0.Z[-updateA]`, where `Z` in `3.0.Z` represents the VLP v3.0 release revision, and `A` indicates the update number, if applicable.

    !!! content-wrapper no-indent table-commit "commit=2&issued=4&update=5"

        {{ read_csv('./_tables/vlp3.0.x_early_access_fixes.csv') }}

    !!! note

        Always verify the latest information on the official [Renesas webpages](https://www.renesas.com){: target=_blank } for VLP v3.0 listed below:

        *   [RZ/G Verified Linux Package [5.10-CIP]](https://www.renesas.com/en/software-tool/rzg-verified-linux-package-cip){: target=_blank }
        *   [RZ/V Verified Linux Package [5.10-CIP]](https://www.renesas.com/en/software-tool/rzv-verified-linux-package){: target=_blank }
        *   [RZ/Five Verified Linux Package [5.10-CIP]](https://www.renesas.com/en/software-tool/rzfive-verified-linux-package-510-cip){: target=_blank }

## How to Apply a Patch to the Renesas Yocto Build Layer

To apply a fix from the Renesas Yocto build layer:

*   Replace your existing `meta-renesas` layer with the updated version (see [here](#replacing-the-renesas-yocto-build-layer)).
*   Backport the relevant commit referenced in the [Affected VLP Releases](#affected-vlp-releases) table (see [here](#backporting-a-specific-commit-from-the-renesas-yocto-build-layer)).

!!! danger "Caution"

    Ensure that you use the latest recommended commit for the affected VLP release.

    Checking out older commits may introduce known issues or incompatibilities that have already been addressed in later revisions.

### Replacing the Renesas Yocto Build Layer

1.  Navigate to your work directory

    ``` bash
    cd ${WORK}
    ```
    {: .dollar }

2.  Remove the existing `meta-renesas` layer

    ``` bash
    rm -rf ${WORK}/meta-renesas
    ```
    {: .dollar }

    !!! danger "Caution"

        This command permanently removes the existing `meta-renesas` layer from your work directory.

        Ensure that any required changes are backed up before proceeding. Users are responsible for verifying the impact of this operation on their development environment.

3.  Clone the VLP Yocto build layer (`meta-renesas`)

    ``` bash
    git clone https://github.com/renesas-rz/meta-renesas.git --branch <reference branch name>
    ```
    {: .dollar }

    !!! note

        `<reference branch name>` refers to the repository branch specified in the note for the corresponding entry in the [Affected VLP Releases](#affected-vlp-releases).

4.  Navigate to the cloned `meta-renesas` repository

    ``` bash
    cd ${WORK}/meta-renesas
    ```
    {: .dollar }

5.  Check out the commit associated with the required VLP fix

    ``` bash
    git checkout -b tmp-$(date +%Y%m%d%H%M%S) <commit id>
    ```
    {: .dollar }

    !!! danger "Caution"

        Refer to the **Commit ID** column in the [Affected VLP Releases](#affected-vlp-releases) table to obtain the `<commit id>`.

6.  Navigate to your work directory

    ``` bash
    cd ${WORK}
    ```
    {: .dollar }

7.  Initialize build environment

    === "Yocto 5.0 (Scarthgap)"

        ``` bash
        TEMPLATECONF=${PWD}/meta-renesas/meta-rz-distro/conf/templates/rz-bsp-plus-conf/ source poky/oe-init-build-env build
        ```
        {: .dollar }

    ===+ "Yocto 3.1 (Dunfell)"

        ``` bash
        TEMPLATECONF=${PWD}/meta-renesas/meta-${PLATFORM}/docs/template/conf/ source poky/oe-init-build-env build
        ```
        {: .dollar }

8.  Build

    ``` bash
    MACHINE=${BOARD} bitbake <image name>
    ```
    {: .dollar }

    !!! note

        Depending on your environment and VLP configuration, one or more of the following image targets (`<image name>`) may be available:

        *   `core-image-minimal`
        *   `core-image-weston`
        *   `core-image-qt`

### Backporting a Specific Commit from the Renesas Yocto Build Layer

#### Get the Patch

To backport a specific fix, obtain the patch using one of the following methods:

1.   Download the patch directly from the [Affected VLP Releases](#affected-vlp-releases) table.
2.   Clone the `meta-renesas` repository into a temporary work directory and generate the patch locally.

    1.  Navigate to your temporary work directory

        ``` bash
        cd ${TEMP_WORK}
        ```
        {: .dollar }

    2.  Clone the VLP Yocto build layer (`meta-renesas`)

        ``` bash
        git clone https://github.com/renesas-rz/meta-renesas.git --branch <reference branch name>
        ```
        {: .dollar }

        !!! note

            `<reference branch name>` refers to the repository branch specified in the note for the corresponding entry in the [Affected VLP Releases](#affected-vlp-releases).

    3.  Navigate to the cloned `meta-renesas` repository

        ``` bash
        cd ${TEMP_WORK}/meta-renesas
        ```
        {: .dollar }

    4.  Check out the commit associated with the required fix

        ``` bash
        git checkout -b tmp-$(date +%Y%m%d%H%M%S) <commit id>
        ```
        {: .dollar }

        !!! danger "Caution"

            Refer to the **Commit ID** column in the [Affected VLP Releases](#affected-vlp-releases) table to obtain the `<commit id>`.

    5.  Generate the patch file

        ``` bash
        git format-patch -1
        ```
        {: .dollar }

    After generating or downloading the patch, apply it to your local source tree and rebuild the affected components.

    !!! danger "Caution"

        Any merge conflicts encountered during patch application must be reviewed and resolved before proceeding with the build.

#### Applying a Patch

To apply patch, please navigate to the `meta-renesas` repository in your work directory:

``` bash
cd ${WORK}/meta-renesas
```
{: .dollar }

Apply the patch using `git am`:

``` bash
git am <patch file>
```
{: .dollar }
