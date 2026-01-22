# DEBUGGING.md

This is a guide for debugging the Simple XLS Toolbox project using your favorite
IDE.

## VSCode Debugging Configuration

Inspiration for a vscode/launch.json configuration for debugging.

Make sure to adjust the paths to your Deno installation and the files you want
to debug.

`runtimeExecutable` should point to your Deno binary location.

You can create a `launch.json` using the debugger icon in the sidebar of VSCode
and clicking on "create a launch.json file". Then select "Deno" as environment.

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "request": "launch",
      "name": "Compare Headers",
      "type": "node",
      // "program": "${workspaceFolder}/main.ts",
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "test"
      },
      "runtimeExecutable": "/home/<username>/Code/distroboxes/devbox/.local/share/mise/installs/deno/2.6.0/bin/deno",
      "runtimeArgs": [
        "run",
        "--allow-all",
        "--inspect-wait",
        "./main.ts",
        "compare-headers",
        "--file1",
        "./test/resources/test1.xlsx",
        "--sheet1",
        "data",
        "--file2",
        "./test/resources/test2.xlsx",
        "--sheet2",
        "data"
      ],
      "attachSimplePort": 9229  
    },
    {
      "request": "launch",
      "name": "Validate Excel",
      "type": "node",
      // "program": "${workspaceFolder}/main.ts",
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "test"
      },
      "runtimeExecutable": "/home/<username>/Code/distroboxes/devbox/.local/share/mise/installs/deno/2.6.0/bin/deno",
      "runtimeArgs": [
        "run",
        "--allow-all",
        "--inspect-wait",
        "./main.ts",
        "validate-excel",
        "--file",
        "./test/resources/sample_validation.xlsx",
        "--sheet",
        "sheet1",
        "--validateSheet",
        "./test/resources/sample_schema.js"
      ],
      "attachSimplePort": 9229  
    },
    {
      "request": "launch",
      "name": "Launch Program",
      "type": "node",
      "program": "${workspaceFolder}/main.ts",
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "test"
      },
      "runtimeExecutable": "/home/<username>/Code/distroboxes/devbox/.local/share/mise/installs/deno/2.6.0/bin/deno",
      "runtimeArgs": [
        "run",
        "--unstable",
        "--inspect-wait",
        "--allow-all"
      ],
      "attachSimplePort": 9229
    }
  ]
}
```
