# CV-module
Разработка модуля компьютерного зрения на базе SiPeed Lichee Module 4A для опытного образца самоходного автоматизированного телеметрического комплекса

### Setup on macOS with VS Code

1. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

2. Install Homebrew and basic tools:
   ```bash
   brew update
   brew install python git wget vim
   ```

3. Check Python:
   ```bash
   python3 --version
   pip3 --version
   ```

4. Create a virtual environment:
   ```bash
   cd ~
   python3 -m venv ort
   source ~/ort/bin/activate
   ```

5. Install Visual Studio Code from the official website and add the `code` command to PATH:
   - Open VS Code
   - Press `Cmd + Shift + P`
   - Run `Shell Command: Install 'code' command in PATH`

6. Install the `Remote - SSH` extension in VS Code and connect to Lichee Pi 4A over SSH.
