module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "type-enum": [2, "always", [
            'build',
            'feat',
            'fix',
            'docs',
            'style',
            'refactor',
            'test',
            'revert',
            'release'
        ]
        ]
    }
};
