# arm-vs-code-extension

This VS Code extension adds hover-based expansion of `.equ` symbolic constants commonly used in ARM assembly files.

## Features

- Highlights `.equ` symbolic constants and their usages.
- Hovering over a symbol shows its defined value.
- Lightweight, with no extra configuration needed.

![Symbolic Constant Definition](img/symbolic_constant.png)  
*Definition of symbolic constants using `.equ`*

![Symbolic Constant Expansion](img/symbolic_constant_expansion.png)  
*Hover shows what each symbol expands to*

## Requirements

No dependencies. It works out of the box.

## Extension Settings

This extension does not currently contribute any user-configurable settings.

## Known Issues

No known issues at the moment.  
Feel free to open an issue or pull request if you encounter a problem or want to suggest an improvement.

## Release Notes

### 1.0.0

- Initial release
- Parses `.equ` statements and maps symbols to values
- Adds hover decorations for all usages of defined symbols
- Currently only supports simple constant values (no expressions or nested macros)

---

## Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## License

MIT
