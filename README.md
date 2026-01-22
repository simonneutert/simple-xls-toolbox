# Simple XLS Toolbox

[![Deno CI](https://github.com/simonneutert/simple-xls-toolbox/actions/workflows/deno-test.yml/badge.svg)](https://github.com/simonneutert/simple-xls-toolbox/actions/workflows/deno-test.yml)

The _Simple XLS Toolbox_ is a Deno-based command-line application that allows
you to run some logic against Excel files.

It currently supports two main functions:

1. **Compare Excel File Headers**: Compare the headers of two Excel files to
   identify differences in column names and order.
2. **Validate Excel File Against a Schema**: Validate the data in an Excel file
   against a predefined schema using
   [Zod-xlsx](https://github.com/sidwebworks/zod-xlsx) (based on the infamous
   [Zod](https://zod.dev/)).

## What you need to bring and what you'll learn

- You need basic knowledge of TypeScript / JavaScript.
  - If you did not already know about Deno, you'll learn how amazing
    [DenoJS](https://deno.land/) is.
  - [Zod](https://zod.dev/) (for validation schemas) - this is an invaluable
    skill by itself.
- You need basic knowledge of Excel files.
  - So, learning this software will help you hate them less.
- You need very basic skills using a terminal.
- _Optionally_ you'll need basic knowledge of Docker/Podman (for container
  usage).

## Rationale

Companies often use Excel files for data exchange and storage. However, ensuring
the integrity and correctness of the data within these files can be challenging.

Sometimes, data is missing, columns are misnamed, or values do not conform to
expected formats. This can lead to errors in data processing and analysis.

The _Simple XLS Toolbox_ provides a straightforward way to validate Excel file
data against predefined schemas using Zod, a TypeScript-first schema declaration
and validation library.

![Simple XLS Toolbox Visualisation - A comic of an Excel file being interrogated by two agents.](ai_logo.jpg)

## Limitations

> [!IMPORTANT]\
> This was tested against CSV-like Excel files. Complex Excel files with merged
> cells, formulas, and special formatting may not work.
>
> If you encounter issues, write an issue that will help others understand the
> boundaries of this tool.
>
> Better yet, contribute a fix or improvement (tests will be mandatory - but I'm
> sure we will figure sth out to make it happen 😘).

## Contributions

I welcome contributions! If you have ideas for new features, improvements, or
bug fixes, please feel free to open an issue or submit a pull request.

Write an issue first, let's discuss your idea before you start working on it.

If we agree on the idea, fork, implement, test, and submit a pull request.

This is a personal project, so please be patient if I don't respond immediately.
Please, do not expect fast turnaround times. Please, do NOT take it personally,
if I reject your wishes or contributions. I try to keep this project aligned
with my personal goals and time constraints. ❤️‍🩹\
The better the quality of your communication / contribution, the higher the
chance of acceptance. Many thanks for your understanding.

Let's make the world a better place, one Excel file at a time! 🚀

More details in [CONTRIBUTING.md](CONTRIBUTING.md).

## Functions

Run the following commands using Deno (or the compiled binary after building the
project):

- compare-headers: Compare headers of two Excel files.
- validate-excel: Validate Excel file data against a schema.

### --help

```sh
deno main.ts --help
# or
./simple-xls-toolbox --help
```

### Compare Excel File Headers

```sh
deno main.ts compare-headers \
    --file1 ./test/resources/test1.xlsx \
    --sheet1 data \
    --file2 ./test/resources/test2.xlsx \
    --sheet2 data
```

### Validate Excel File Against a Schema

```sh
deno main.ts validate-excel \
    --file ./test/resources/sample_validation.xlsx \
    --sheet sheet1 \
    --validateSheet ./test/resources/sample_schema.js
```

```sh
# run the validator directly
NODE_ENV=test deno run src/validate-excel.ts \
    --file test/resources/sample_validation.xlsx \
    --sheet sheet1 \
    --validateSheet test/resources/sample_schema.js
```

## Running Tests and Validations

```sh
deno test --allow-import --allow-env
```

```sh
NODE_ENV=test deno main.ts compare-headers
```

## Use the simple-xls-toolbox binary with your own files and schema

1. Download the matching executable binary for your OS from the releases page.
   Or build it yourself by following the instructions in the repository.
2. Write your own Zod schema file for validation. See
   [sample_schema.js](test/resources/sample_schema.js) for an example.
3. Run the validator with your Excel file and schema:

```sh
./simple-xls-toolbox validate-excel \
  --file path/to/yourfile.xlsx \
  --sheet Sheet1 \ 
  --validateSheet path/to/your_schema.js
```

```sh
./simple-xls-toolbox compare-headers \
  --file1 path/to/file1.xlsx \
  --sheet1 Sheet1 \
  --file2 path/to/file2.xlsx \
  --sheet2 Sheet2
```

## Building from Source

1. Ensure you have Deno installed on your system. You can download it from
   [deno.land](https://deno.land/).
2. Clone the repository.
3. Run the build command:
   ```sh
   deno task package
   ```
4. The compiled binary will be available in the project directory.

## Using Docker/Podman

This project uses a Distroless container image for its final Docker build.
Distroless images contain only the application and its runtime dependencies,
without package managers or shells. This approach helps reduce image size and
improves security by minimizing the attack surface.

```sh
# clone the repository, then change into its directory.
# build the container image:
podman build -t simple-xls-toolbox:latest -f Containerfile .
```

Run the validator with your Excel file and schema inside the container:

```sh
# Example command how you could run the container image. 
# Make sure that you use `/app/data` as the mount point inside the container,
# as /app is the working directory of the container image.
podman run --rm -it \
  -v $(pwd):/app/data:ro,Z \ # :Z is needed for SELinux systems like Fedora, :ro makes the mount read-only
  simple-xls-toolbox:latest \
  validate-excel \
  --file data/sample_validation.xlsx \ # the path to your file on the host, prefixed with 'data/' to match the mount point
  --sheet Sheet1 \
  --validateSheet data/sample_schema.js # the path to your schema on the host, prefixed with 'data/' to match the mount point
```

## Sample Schema File

Put this in a file, e.g., `my_company_schema.js` and adjust it to your needs.

Line breaks in column names are supported. Simply use `\n` in the string for a
line break.

```js
// super_simple_sample_schema.js
// you can find a more complex example template
// with all the tested bells and whistles
// in: test/resources/sample_schema.js
import { z } from "zod";

const schema = z.object({
  "Levels": z.number(),
  "Description": z.string().min(3),
  "HaveYouEver": z.enum(["Yes", "No"]),
  Colors: z.enum(["red", "green", "blue"]),
});

export default schema;
```

Run the validator with your Excel file and schema:

```sh
deno main.ts validate-excel \
   --file path/to/yourfile.xlsx \
   --sheet Sheet1 \
   --validateSheet path/to/my_company_schema.js
```

If you miss the column name, because of a typo or different naming, the
validator will inform you about it.

```text
Row with first column value '1' has invalid fields.
        - Field "Colooooooors": Value: "undefined" 
        Invalid option: expected one of "red"|"green"|"blue"
```

## Header Comparison Console Output

When comparing headers of two Excel files, the output will indicate whether the
headers match or if there are discrepancies.

```sh
NODE_ENV=test deno --allow-all main.ts compare-headers
```

will output something like this if there are differences:

```text
Headers in test/resources/test1.xlsx (data): [ "m", "n\n\nb", "a", "m_1" ]
Headers in test/resources/test2.xlsx (data): [
  "a", "b", "c", "d",
  "e", "f", "g", "h",
  "i", "j", "k"
]
Headers only in file 1: [ "m", "n\n\nb", "m_1" ]
Headers only in file 2: [
  "b", "c", "d", "e",
  "f", "g", "h", "i",
  "j", "k"
]
Header order/content mismatches detected:
Header: 'a' moved from: C to: A
```

## FAQ

1\. The app fails to run because of missing permissions.

`chmod +x ./simple-xls-toolbox`

2\. I have trouble starting the binary on MacOS.

- Start it from the terminal.
- If you get a security warning, go to System Preferences -> Security & Privacy
  and allow the app to run.
- Try again from the terminal.

3\. How can I see what's changed in each version?

- Check the `CHANGELOG.md` file in the repository. It documents all notable
  changes, new features, bug fixes, and improvements made in each version.

4\. My validation schema is not working as expected. The import of code fails.

- You must export your functions properly, in order to import them.
- You must use JavaScript (not TypeScript!)
- Write the needed logic directly in your schema file to avoid import issues.

Read the comments in [sample_schema.js](test/resources/sample_schema.js) for
more details.
