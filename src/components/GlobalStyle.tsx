import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/animations/shift-away.css'

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
:root {
    --color-black: #000000;
    --color-gray: #474d66;
    --color-white: #ffffff;

    --color-blue: #3366ff;
    --color-green: #52bd94;
    --color-yellow: #ffb020;
    --color-red: #d14343;

    /* Neutral */
    --color-n0: #ffffff;
    --color-n50: #fbfbfb;
    --color-n75: #f9f9f9;
    --color-n100: #f4f4f4;
    --color-n200: #edeff5;
    --color-n300: #e6e8f0;
    --color-n400: #d8dae5;
    --color-n500: #c1c4d6;
    --color-n600: #8f95b2;
    --color-n700: #696969;
    --color-n800: #474747;
    --color-n900: #101820;

    /* Blue */
    --color-b50: #f3f6ff;
    --color-b100: #ebf0ff;
    --color-b200: #d6e0ff;
    --color-b300: #9db5ff;
    --color-b400: #3366ff;
    --color-b500: #2952cc;
    --color-b600: #1f3d99;

    /* Red */
    --color-r50: #fdf4f4;
    --color-r100: #f9dada;
    --color-r200: #f4b6b6;
    --color-r300: #ee9191;
    --color-r400: #d14343;
    --color-r500: #a73636;
    --color-r600: #7d2828;
}

html,
body,
div#__next {
    padding: 0;
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
        sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol,
        "Noto Color Emoji";
    min-width: 350px;
}

html,
body,
body > div:first-child,
div#__next,
div#__next > div {
    height: 100%;
}

a {
    color: inherit;
    text-decoration: none;
    outline-color: var(--color-b200);
}

* {
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

/*
* TEMPORARY
*/

.drag-handle {
    position: fixed;
    opacity: 1;
    transition: opacity ease-in 0.2s;
    border-radius: 0.25rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(55, 53, 47, 0.3)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
    background-repeat: no-repeat;
    background-position: center;
    width: 1.2rem;
    height: 1.5rem;
    cursor: grab;
    z-index: 999;

    &.hidden {
        opacity: 0;
        pointer-events: none;
    }

    &:hover {
        background-color: #0d0d0d10;
        transition: background-color ease-out 0.2s;
    }
}
`

export default GlobalStyle