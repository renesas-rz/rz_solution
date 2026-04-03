## RZ MPU and SoC-Related Resources

This section collects useful references for RZ MPU platforms, including Renesas-provided documentation, evaluation board information, and related external resources.

### RZ MPU Product Pages

* [RZ/G2L](https://www.renesas.com/en/products/rz-g2l){: target=_blank } — General-Purpose MPU with Dual-Core Arm Cortex-A55 CPUs with 3D Graphics and Video Codec Engine.
* [RZ/G2LC](https://www.renesas.com/en/products/rz-g2lc){: target=_blank } — General-Purpose MPUs with Dual-Core Arm Cortex-A55 (1.2GHz) CPUs with 3D Graphics.
* [RZ/G2UL](https://www.renesas.com/en/products/rz-g2ul){: target=_blank } — General-Purpose Microprocessors with Single-Core Arm Cortex-A55 (1.0GHz) CPU with 2ch Gigabit Ethernet.
* [RZ/FIVE](https://www.renesas.com/en/products/rz-five){: target=_blank } — General-purpose Microprocessors with RISC-V CPU Core (Andes AX45MP Single) (1.0 GHz) with 2ch Gigabit Ethernet.
* [RZ/G3S](https://www.renesas.com/en/products/rz-g3s){: target=_blank } — General-Purpose Microprocessors with Single-Core Arm Cortex-A55 (1.1GHz) CPU and Dual-Core Cortex-M33 (250MHz) CPU, Supporting Low-Power Mode and PCI Express.
* [RZ/G3E](https://www.renesas.com/en/products/rz-g3e){: target=_blank } — General-Purpose MPU with Quad-Core CPU, and NPU for HMI Applications with High-Performance Computing.
* [RZ/V2M](https://www.renesas.com/en/products/rz-v2m){: target=_blank } — AI Accelerator (DRP-AI), 4K-compatible Image Signal Processor (ISP), Vision-AI ASSP for Real-time Human and Object Recognition.
* [RZ/V2MA](https://www.renesas.com/en/products/rz-v2ma){: target=_blank } — Vision AI MPU With Renesas DRP-AI High-efficiency AI Accelerator and OpenCV Image Processing Accelerator Enabling Real-time Object Recognition.
* [RZ/V2L](https://www.renesas.com/en/products/rz-v2l){: target=_blank } — General-Purpose Microprocessor Equipped With Renesas' Original AI Accelerator "DRP-AI", 1.2GHz Dual-Core Arm Cortex-A55 CPU, 3D Graphics, and Video Codec Engine.
* [RZ/V2H](https://www.renesas.com/en/products/rz-v2h){: target=_blank } — Quad-core Vision AI MPU with DRP-AI3 Accelerator and High-Performance Real-time Processor.
* [RZ/V2N](https://www.renesas.com/en/products/rz-v2n){: target=_blank } — 15TOPS Quad-Core Vision AI MPU with 2-Camera Connection and Excellent Power Efficiency.
* [RZ/T2H](https://www.renesas.com/en/products/rz-t2h){: target=_blank } — Advanced High-End MPU with Integrated Powerful Application Processing and High-Precision Real-Time Control for 9-Axis Motor Control.
* [RZ/N2H](https://www.renesas.com/en/products/rz-n2h){: target=_blank } — Advanced MPU Delivers High-Performance Application Processing and Real-Time Operation with Industrial Ethernet.

### Evaluation Board Kits (EVKs)

* [RZ/G2L Evaluation Board Kit (RZ/G2L-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-g2l-evkit){: target=_blank }
* [RZ/G2LC Evaluation Board Kit (RZ/G2LC-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-g2lc-evkit){: target=_blank }
* [RZ/G2UL Evaluation Board Kit (RZ/G2UL-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-g2ul-evkit){: target=_blank }
* [RZ/Five Evaluation Board Kit (RZ/Five-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-five-evkit){: target=_blank }
* [RZ/G3S Evaluation Board Kit (RZ/G3S-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-g3s-evkit){: target=_blank }
* [RZ/G3E Evaluation Board Kit (RZ/G3E-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-g3e-evkit){: target=_blank }
* [RZ/V2M Evaluation Board Kit (RZ/V2M-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-v2m-evkit){: target=_blank }
* [RZ/V2MA Evaluation Board Kit (RZ/V2MA-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-v2ma-evkit){: target=_blank }
* [RZ/V2L Evaluation Board Kit (RZ/V2L-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-v2l-evkit){: target=_blank }
* [RZ/V2H Evaluation Board Kit (RZ/V2H-EVK)](https://www.renesas.com/en/design-resources/boards-kits/rz-v2h-evk){: target=_blank }
* [RZ/V2N Evaluation Board Kit (RZ/V2N-EVK)](https://www.renesas.com/en/design-resources/boards-kits/rz-v2n-evk){: target=_blank }
* [RZ/T2H Evaluation Board Kit (RZ/T2H-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-t2h-evkit){: target=_blank }
* [RZ/N2H Evaluation Board Kit (RZ/N2H-EVKIT)](https://www.renesas.com/en/design-resources/boards-kits/rz-n2h-evkit){: target=_blank }

### Renesas RZ Software

RZ Software source code, Yocto meta-layers, and documents are hosted in git repositories on GitHub ([renesas-rz](https://github.com/renesas-rz){: target=_blank }).

* [Linux Kernel](https://github.com/renesas-rz/rz_linux-cip){: target=_blank } — Linux kernel for RZ MPU Linux BSP. For information about the kernel, see [wiki](https://github.com/renesas-rz/rz_linux-cip/wiki){: target=_blank }.
* [u-boot](https://github.com/renesas-rz/renesas-u-boot-cip) — U-boot for RZ MPU Linux BSP. For information about the u-boot, see [wiki](https://github.com/renesas-rz/renesas-u-boot-cip/wiki){: target=_blank }.
* [Trusted Firmware-A](https://github.com/renesas-rz/rzg_trusted-firmware-a){: target=_blank } — Trusted Firmware-A (TF-A) for RZ MPU. For information about the TF-A, see [wiki](https://github.com/renesas-rz/rzg_trusted-firmware-a/wiki){: target=_blank }.
* [Boot Loader Programmer](https://github.com/renesas-rz/rzg2_flash_writer){: target=_blank } — Flash Writer for RZ MPU. For information about the flash writer, see [README](https://github.com/renesas-rz/rzg2_flash_writer/blob/master/README.md){: target=_blank } and [wiki](https://github.com/renesas-rz/rzg_trusted-firmware-a/wiki){: target=_blank }.
* [Yocto meta-layer for RZ Linux BSP](https://github.com/renesas-rz/meta-renesas){: target=_blank } — For information about the meta-layer, see [README](https://github.com/renesas-rz/meta-renesas/blob/scarthgap/rz/README.md){: target=_blank }.
* [Yocto meta-layer for RZ/G Linux HMI SDK](https://github.com/renesas-rz/meta-rz-demos){: target=_blank } — For information about the SDK, visit [the HMI SDK website](https://renesas-rz.github.io/rzg_hmi_sdk/latest/){: target=_blank }.

