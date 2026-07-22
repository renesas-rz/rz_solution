<div class="grid cards" markdown>
- <span class="banner-hover-effect">[![BSP Plus Link](home/images/Button_LinuxBSPPlus.png)](https://renesas-rz.github.io/rz_linux_bsp_plus/)</span><br>
  <span class="tag_supported" data-tooltip="Supported">RZ/G</span> <span class="tag_planning" data-tooltip="Planning">RZ/V</span> <span class="tag_supported" data-tooltip="Supported">RZ/T</span> <span class="tag_supported" data-tooltip="Supported">RZ/N</span><br>
  Latest LTS kernel & Latest Yocto Linux BSP + Standard S/W<br>
  <span class="text-highlight">
  Release Cadence : Annual<br>
  Support : 1yrs
  </span>
{: .custom-bg }

- <span class="banner-hover-effect">[![VLP Link](home/images/Button_VLP.png)](https://renesas-rz.github.io/rz_verified_linux_package/)</span><br>
  <span class="tag_supported" data-tooltip="Supported">RZ/G</span> <span class="tag_supported" data-tooltip="Supported">RZ/V</span> <span class="tag_supported" data-tooltip="Supported">RZ/T</span> <span class="tag_supported" data-tooltip="Supported">RZ/N</span><br>
  CIP/SLTS Kernel based on the latest Linux BSP Plus Verified by Renesas<br>
  <span class="text-highlight">
  Release Cadence : Every 2yrs<br>
  Support : 10yrs
  </span>
{: .custom-bg }

- <span class="banner-hover-effect">[![Ubuntu Debian Link](home/images/Button_UbuntuDebian.png)](https://renesas-rz.github.io/rz_linux_distros/)</span><br>
  <span class="tag_supported" data-tooltip="Supported">RZ/G</span> <span class="tag_planning" data-tooltip="Planning">RZ/V</span><br>
  Latest Ubuntu/Debian based on the latest VLP<br><br>
  <span class="text-highlight">
  Release Cadence : Every 2yrs<br>
  Support : 2yrs
  </span>
{: .custom-bg }

- <span class="banner-hover-non-effect">![SDK Link](home/images/Button_SDK.png)</span><br>
  <b>HMI</b> : <span class="tag_supported" data-tooltip="Supported">RZ/G</span><b> AI</b> : <span class="tag_supported" data-tooltip="Supported">RZ/V</span><br>
  [:material-link: HMI SDK : GUI Framework](https://renesas-rz.github.io/rzg_hmi_sdk/)<br>
  [:material-link: AI SDK : Vision AI Application](https://renesas-rz.github.io/rzv_ai_sdk/)<br>
  <span class="text-highlight">
  Release Cadence : Every 2yrs<br>
  Support : 2yrs
  </span>
{: .custom-bg }

- <span class="banner-hover-effect">[![AOSP Link](home/images/Button_AOSP.png)](https://renesas-rz.github.io/rz_aosp)</span><br>
  <span class="tag_planning" data-tooltip="Planning">RZ/G</span> <span class="tag_supported" data-tooltip="Supported">RZ/V</span><br>
    Software package based on AOSP with development tools,
    system libraries, and graphics and multimedia support.<br>
    <small>_Android is a trademark of Google LLC._</small>
{: .custom-bg }

</div>

### Supported MPU List

!!! content-wrapper no-indent table-no-sort  md-supportlist ""

    {{ read_csv('home/_tables/supported_mpu_list.csv', na_filter=False) }}

    1.  Support for each VLP version is as follows
        *   VLPv1(Kernel4.10): RZ/G2H, RZ/G2M, RZ/G2N, RZ/G2E
        *   VLPv2(Kernel4.4): RZ/G1H, RZ/G1M, RZ/G1N, RZ/G1E, RZ/G1C
        *   VLPv3(Kernel5.10): RZ/G1H, RZ/G1M, RZ/G1N, RZ/G1E, RZ/G1C, RZ/G2H, RZ/G2M, RZ/G2N, RZ/G2E, RZ/G2L, RZ/G2LC, RZ/G2UL, RZ/G3S, RZ/FIVE, RZ/V2M, RZ/V2MA, RZ/V2L
        *   VLPv4(Kernel6.1): RZ/G2L, RZ/G2LC, RZ/G2UL, RZ/G3S
        *   VLPv5(Kernel6.12): RZ/T2H, RZ/N2H[↩](#tfref:1){: .tf-backref }
    {: #tf:1 }
