module.exports = {
    "root": true,
    "extends": "airbnb",
    "installedESLint": true,
    "env": {
        "es6": true,
        "node": true,
        "commonjs": true
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "shells/wechat/webpack.config.js"
            }
        }
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "import",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:react/recommended"
    ],
    "globals": {
        "App": true,
        "Page": true,
        "getApp": true,
        "wx": true
    },
    "rules": {
        "no-console": [
            "error",
            {"allow": ["warn", "error"]}
        ],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "off",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
