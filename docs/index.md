---
history:
  enabled: false

banners:
  - title: Linux BSP Plus
    subtitle: For Linux expert
    url: https://renesas-rz.github.io/rz_linux_bsp_plus/
    mpu:
      - name: RZ/G
        supported: true
      - name: RZ/V
        supported: false
      - name: RZ/T
        supported: true
      - name: RZ/N
        supported: true
    description: Latest LTS Kernel & Latest Yocto Linux BSP + Standard S/W.
    release_cadence: Annual
    support: 1yr
  - title: Verified Linux Package
    subtitle: Super long-term maintenance
    url: https://renesas-rz.github.io/rz_verified_linux_package/
    mpu:
      - name: RZ/G
        supported: true
      - name: RZ/V
        supported: true
      - name: RZ/T
        supported: true
      - name: RZ/N
        supported: true
    description: CIP/SLTS Kernel based on The Latest Linux BSP Plus Verified by Renesas.
    release_cadence: Every 2yrs
    support: 10yrs
  - title: Ubuntu/Debian
    subtitle: Mainstream Linux distribution
    url: https://renesas-rz.github.io/rz_linux_distros/
    mpu:
      - name: RZ/G
        supported: true
      - name: RZ/V
        supported: false
    description: Latest Ubuntu/Debian based on The Latest VLP.
    release_cadence: Every 2yrs
    support: 2yrs
  - title: HMI SDK
    subtitle: Easy-to-use Graphics Framework
    url: https://renesas-rz.github.io/rzg_hmi_sdk/
    mpu:
      - name: RZ/G
        supported: true
    description: The HMI SDK supports GUI frameworks, making it easy for Linux beginner to develop HMI applications.
    release_cadence: Every 2yrs
    support: 2yrs
  - title: AI SDK
    subtitle: Vision AI Development Framework
    url: https://renesas-rz.github.io/rzv_ai_sdk/
    mpu:
      - name: RZ/V
        supported: true
    description: Jumpstart AI application development by using AI SDK samples.
    release_cadence: Every 2yrs
    support: 2yrs
  - title: AOSP
    subtitle: Android&trade; Open Source Project
    url: https://renesas-rz.github.io/rz_aosp/
    mpu:
      - name: RZ/G
        supported: false
      - name: RZ/V
        supported: true
    description: Software package based on AOSP with development tools, system libraries, and graphics and multimedia support.
    sub_description: Android is a trademark of Google LLC.
---

# Renesas RZ Linux Solutions

{% include "./home/_components/__front_matter.md" %}

{% if history.enabled %}
{% include "./history/_components/__front_matter.md" %}
{% endif %}

{% include "./home/index.md" %}
