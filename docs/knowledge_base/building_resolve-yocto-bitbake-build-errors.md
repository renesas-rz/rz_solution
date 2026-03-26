# How to resolve Yocto Bitbake build errors

!!! abstract "Page Information"
    Last updated: ***March 26, 2026***

There are various reasons for errors or forced termination, but the following are some possible causes.

- [Errors in fetching the source code (do_fetch)](#errors-in-fetching-the-source-code-do_fetch)
- [Other errors](#other-errors)

<!-- 
TODO:
When content increases, create sections according to Bitbake tasks such as do_fetch, do_compile, and so on.
-->

## Errors in fetching the source code (do_fetch)

### Fetch failures caused by parallel BitBake tasks

When BitBake runs multiple fetch tasks in parallel, resource conflicts or temporary network issues may cause fetch operations to fail.
In such cases, rebuilding the affected component individually can often resolve the problem.
The following example shows how to rebuild `gcc` separately.

```bash
MACHINE=${BOARD} bitbake -c cleansstate gcc
MACHINE=${BOARD} bitbake gcc
```
{: .dollar }

The cleansstate task removes all previously generated build artifacts for the specified component and forces BitBake to rebuild it from scratch.
This approach can help resolve issues caused by a corrupted build state, incomplete or failed downloads, or inconsistent dependencies.
If the individual build succeeds, run the original full build command again.
BitBake will resume the build from the remaining, unfinished tasks.


### Fetch failures caused by server issues

The server hosting the affected component may be temporarily offline or unreachable due to maintenance or server relocation.

If the server is only temporarily unavailable, it may become accessible again later.
In this case, try running the build command again after some time.
The fetch operation may succeed.

If the server has been permanently relocated or the original resource has been removed, you need to update the `SRC_URI` in the recipe for the affected component.
Replace the existing URL in `SRC_URI` with the new valid address.

If you cannot find an alternative download location, using a source code package may be an option.
Some RZ Linux solutions provide source code packages that allow you to build the Linux environment offline.
Please refer to the manual for each solution for details.


## Other errors

### Build process killed due to out-of-memory conditions

If the Yocto build process is killed unexpectedly, it is often caused by insufficient memory on the build machine.
One possible workaround is to limit the number of tasks that BitBake runs in parallel, which can reduce peak memory usage during the build.
`#!bash BB_NUMBER_THREADS` controls how many BitBake tasks are executed simultaneously.
In addition, you should also set `#!bash PARALLEL_MAKE`, which controls how many parallel jobs the make command runs within each task.
These parameters can be configured in `#!bash local.conf` as shown below:

```
BB_NUMBER_THREADS = "4"
PARALLEL_MAKE = "-j4"
```

In this example, both values are set to `4`.
These values should be adjusted according to the number of CPU cores and the available memory of your build system.

Please note that reducing these values may significantly increase build time.
Adjust them according to the available memory and CPU resources of your build environment.

For more detailed information, refer to the following links.

* Yocto 5.0 (scarthgap)
    * [BB_NUMBER_THREADS](https://docs.yoctoproject.org/5.0.12/ref-manual/variables.html#term-BB_NUMBER_THREADS){: target=_blank }
    * [PARALLEL_MAKE](https://docs.yoctoproject.org/5.0.12/ref-manual/variables.html#term-PARALLEL_MAKE){: target=_blank }

    See also [Speeding Up a Build](https://docs.yoctoproject.org/5.0.12/dev-manual/speeding-up-build.html#speeding-up-a-build){: target=_blank }.

* Yoct 3.1 (dunfell)
    * [BB_NUMBER_THREADS](https://docs.yoctoproject.org/3.1/ref-manual/ref-manual.html#var-BB_NUMBER_THREADS){: target=_blank }
    * [PARALLEL_MAKE](https://docs.yoctoproject.org/3.1/ref-manual/ref-manual.html#var-PARALLEL_MAKE){: target=_blank }

    See also [Speeding Up a Build](https://docs.yoctoproject.org/3.1/dev-manual/dev-manual.html#speeding-up-a-build){: target=_blank }.

