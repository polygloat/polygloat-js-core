# Tolgee React integration library

[<img src="https://raw.githubusercontent.com/tolgee/documentation/cca5778bcb8f57d28a03065d1927fcea31d0b089/tolgee_logo_text.svg" alt="Tolgee Toolkit" />](https://toolkit.tolgee.io)

React integration library of Tolgee localization toolkit. For more information about using Tolgee with React, visit our
documentation [website](https://toolkit.tolgee.io/docs/web/using_with_react/installation).

## Installation

First, install the package.

    npm install @tolgee/react --save

Then use the library in your app:

```typescript jsx
import {TolgeeProvider} from "@tolgee/react";
import {UI} from "@tolgee/ui";

...

<TolgeeProvider
    filesUrlPrefix="i18n/"
    apiUrl={process.env.REACT_APP_TOLGEE_API_URL}
    apiKey={process.env.REACT_APP_TOLGEE_API_KEY}
    ui={process.env.REACT_APP_TOLGEE_API_KEY === "true" && UI}
>
    <Your app components>
</TolgeeProvider>
```

## Usage

To translate texts using Tolgee React integration, you can use `T` component or `useTranslate` hook.

### T component

```typescript jsx
import {T} from "@tolgee/react";

...

<T>translation_key</T>
```

### useTranslate hook

```javascript
import {useTranslate} from "@tolgee/react";

...

const t = useTranslate();

...

t("key_to_translate")
```
