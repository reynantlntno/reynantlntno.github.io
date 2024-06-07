export function executeCommand(command, username, tabContent) {
    const commandParts = command.trim().split(' ');
    const commandName = commandParts[0];

    switch (commandName) {
        case 'whoami':
            return username;
        case 'clear':
            // Clear output lines within the tabContent
            const outputLines = tabContent.querySelectorAll('div');
            outputLines.forEach(line => {
                line.remove();
            });
            return '';
        case 'exit':
            terminalAppDiv.remove(); // Remove the entire terminal app from the screen
            return '';
        case 'help':
            return `Available commands:
    - whoami: Display current username
    - clear: Clear the terminal output
    - exit: Close the terminal app
    - setvar -key keyName=value: Set a key to localStorage
    - setvar -remove keyName: Remove a key from localStorage
    - setvar -show --all: Show all keys and their values from localStorage
    - setvar -show keyName: Show the value of a specific key from localStorage
    - help: Display this help message
            `;
        case 'setvar':
            return setVariable(commandParts.slice(1));
        default:
            return `Command '${commandName}' not found`;
    }
}

function setVariable(args) {
    if (args.length < 1) {
        return 'Invalid arguments for setvar command';
    }

    const key = args[0];
    const keyValue = args.slice(1).join(' ');

    if (key === '-key') {
        const keyValueParts = keyValue.split('=');
        const keyName = keyValueParts[0];
        const value = keyValueParts[1];

        localStorage.setItem(keyName, value);
        return `Set ${keyName} to ${value} in localStorage`;
    } else if (key === '-remove') {
        const keyName = keyValue;

        localStorage.removeItem(keyName);
        return `Removed ${keyName} from localStorage`;
    } else if (key === '-show') {
        if (keyValue === '--all') {
            // Show all keys and their values
            const keys = Object.keys(localStorage);
            let result = '';
            keys.forEach(key => {
                result += `${key}: ${localStorage.getItem(key)}\n`;
            });
            return result.trim();
        } else {
            // Show the value of a specific key
            const value = localStorage.getItem(keyValue);
            if (value !== null) {
                return `${keyValue}: ${value}`;
            } else {
                return `Key '${keyValue}' not found in localStorage`;
            }
        }
    } else {
        return 'Invalid arguments for setvar command';
    }
}
