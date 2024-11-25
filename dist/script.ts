type StylesDictionary = { [key: string]: string };

class StyleSwitcher {
    private currentStyle: string;
    private styles: StylesDictionary;

    constructor(initialStyle: string, styles: StylesDictionary) {
        this.currentStyle = initialStyle;
        this.styles = styles;

        // Apply the initial style
        this.applyStyle(this.currentStyle);

        // Generate dynamic style links
        this.generateStyleLinks();

        // Attach event listeners to links
        this.replaceLinks();
    }

    /**
     * Applies the specified style by updating the <link> tag in the document's <head>.
     * @param styleName - The name of the style to apply.
     */
    private applyStyle(styleName: string): void {
        // Remove the old stylesheet link if it exists
        const oldLink = document.querySelector("link[rel='stylesheet']");
        if (oldLink) {
            oldLink.remove();
        }

        // Add the new stylesheet link
        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = this.styles[styleName];
        document.head.appendChild(newLink);

        // Update current style
        this.currentStyle = styleName;

        // Update the header with the current style
        this.updateCurrentStyleInfo();
        // Refresh the style links
        this.generateStyleLinks();
        this.replaceLinks();
    }

    /**
     * Updates the header with information about the current style.
     */
    private updateCurrentStyleInfo(): void {
        const container = document.querySelector(".header");
        if (!container) return;

        // Find or create the current style info element
        let currentStyleInfo = container.querySelector(".current-style-info");
        if (!currentStyleInfo) {
            currentStyleInfo = document.createElement("span");
            currentStyleInfo.className = "current-style-info";
            container.appendChild(currentStyleInfo);
        }
    }

    /**
     * Dynamically generates style links and adds them to the document.
     */
    private generateStyleLinks(): void {
        const container = document.querySelector(".header");
        if (!container) {
            console.warn("No container found for dynamic links.");
            return;
        }

        // Remove existing dynamic links
        container.querySelectorAll(".style-link, .style-separator").forEach(el => el.remove());

        // Create links for each style in the styles dictionary, excluding the current style
        Object.entries(this.styles).forEach(([styleName, href], index, entries) => {
            if (styleName === this.currentStyle) return;

            const link = document.createElement("a");
            link.href = "#";
            link.className = "style-link";
            link.textContent = styleName.replace(/style(\d+)/, "Style $1   "); // Optional formatting
            link.dataset.style = styleName;
            container.appendChild(link);

        });
    }

    /**
     * Replaces default link behavior with dynamic style switching.
     */
    private replaceLinks(): void {
        const links = document.querySelectorAll<HTMLAnchorElement>(".style-link");
        links.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const styleName = link.dataset.style;

                // Check if the style exists in the dictionary and apply it
                if (styleName && this.styles[styleName]) {
                    this.applyStyle(styleName);
                }
            });
        });
    }
}

// Initialize the style switcher with available styles and the default style
const styles: StylesDictionary = {
    "style1": "/style/style1.css",
    "style2": "/style/style2.css",
    "style3": "/style/style3.css",
    "style4": "/style/style4.css",
    "style5": "/style/style5.css"
};

const initialStyle = "style1";
new StyleSwitcher(initialStyle, styles);
