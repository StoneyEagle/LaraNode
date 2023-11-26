import colors from 'cli-color';

export default (quote: string) => {

	const color = [
		'red',
		'green',
		'yellow',
		'blue',
		'magenta',
		'cyan',
	];

	const pickedColor = color[Math.floor(Math.random() * color.length)];

	const b = colors.bold[`${pickedColor}Bright`];
	const o = colors.bold[pickedColor];
	const t = colors.black;
	const q = colors.bold.whiteBright;

	console.log(
		b(`╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗\n`)
		+ b(`║                                                                                                                                                                                        ║\n`)
		+ b(`║`) + o(`  888b    888`) + t(`          `) + o(`888b     d888`) + t(`                                       `) + o(`  888b     d888`) + t(`                888  d8b          `) + o(`  .d8888b. `) + t(`                                                 `) + b(`║\n`)
		+ b(`║`) + o(`  8888b   888`) + t(`          `) + o(`8888b   d8888`) + t(`                                       `) + o(`  8888b   d8888`) + t(`                888  Y8P          `) + o(` d88P  Y88b`) + t(`                                                 `) + b(`║\n`)
		+ b(`║`) + o(`  88888b  888`) + t(`          `) + o(`88888b.d88888`) + t(`                                       `) + o(`  88888b.d88888`) + t(`                888               `) + o(` Y88b.     `) + t(`                                                 `) + b(`║\n`)
		+ b(`║`) + o(`  888Y88b 888`) + t(`  .d88b.  `) + o(`888Y88888P888`) + t(`  .d88b.   888d888  .d8888b  888  888  `) + o(`  888Y88888P888`) + t(`  .d88b.    .d88888  888   8888b. `) + o(`  "Y888b.  `) + t(`  .d88b.   888d888  888  888   .d88b.   888d888  `) + b(`║\n`)
		+ b(`║`) + o(`  888 Y88b888`) + t(` d88""88b `) + o(`888 Y888P 888`) + t(` d8P  Y8b  888P"   d88P"     888  888  `) + o(`  888 Y888P 888`) + t(` d8P  Y8b  d88" 888  888      "88b`) + o(`     "Y88b.`) + t(` d8P  Y8b  888P"    888  888  d8P  Y8b  888P"    `) + b(`║\n`)
		+ b(`║`) + o(`  888  Y88888`) + t(` 888  888 `) + o(`888  Y8P  888`) + t(` 88888888  888     888       888  888  `) + o(`  888  Y8P  888`) + t(` 88888888  888  888  888  .d888888`) + o(`       "888`) + t(` 88888888  888      Y88  88P  88888888  888      `) + b(`║\n`)
		+ b(`║`) + o(`  888   Y8888`) + t(` Y88..88P `) + o(`888   "   888`) + t(` Y8b.      888     Y88b.     Y88b 888  `) + o(`  888   "   888`) + t(` Y8b.      Y88b 888  888  888  888`) + o(` Y88b  d88P`) + t(` Y8b.      888       Y8bd8P   Y8b.      888      `) + b(`║\n`)
		+ b(`║`) + o(`  888    Y888`) + t(`  "Y88P"  `) + o(`888       888`) + t(`  "Y8888   888      "Y8888P   "Y88888  `) + o(`  888       888`) + t(`  "Y8888    "Y88888  888  "Y888888`) + o(`  "Y8888P" `) + t(`  "Y8888   888        Y88P     "Y8888   888      `) + b(`║\n`)
		+ b(`║`) + o(`             `) + t(`          `) + o(`             `) + t(`                                  888  `) + o(`               `) + t(`                                  `) + o(`           `) + t(`                                                 `) + b(`║\n`)
		+ b(`║`) + o(`             `) + t(`          `) + o(`             `) + t(`                             Y8b d88P  `) + o(`               `) + t(`                                  `) + o(`           `) + t(`                                                 `) + b(`║\n`)
		+ b(`║`) + o(`             `) + t(`          `) + o(`             `) + t(`                              "Y88P"  `) + q(createQuote(quote, 2)) + b(`║\n`)
		+ b(`╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝`)
	);
};

export const createQuote = (text: string, rightPadding: number): string => {
	if (text.length + rightPadding > 210) {
		throw new Error('The text is too long to fit in the quote');
	}
	const spacing: string[] = [];
	// Add spaces to the left of the text
	for (let i = 110 - rightPadding; i > text.length; i--) {
		spacing.push('');
	}
	spacing.push(text);
	// Add spaces to the right of the text
	for (let i = 0; i < rightPadding; i++) {
		spacing.push('');
	}
	return spacing.join(' ');
};
