# Errors in the app

After some manual user testing, these are my findings:

1. In the Go + Wails + JS version, the UI is broken: when you interact with any element, it overlaps and makes it impossible to continue to do anything.
2. The file opener doesn't parse anything: does not open files, or if it does, doesn't properly render them in the app, this has been tested with multiple .gp and .gp3 files.
3. Both problems are true for both the standalone and the webapp version.

After reverting to the previous version of it (TS with Rust), the following problems appeared:

1. The file opener doesn't parse anything: does not open files, or if it does, doesn't properly render them in the app, this has been tested with multiple .gp and .gp3 files.
2. Previous problem is true for both the standalone and the webapp version.

Further (manual) functional testing is, therefore, not possible.
