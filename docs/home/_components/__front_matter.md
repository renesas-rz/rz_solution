{% include "./_banner.html" %}

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

    2.  Coming in 2026/4Q.[↩](#tfref:2){: .tf-backref }
    {: #tf:2 }
