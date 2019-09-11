module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "type-enum": [2, "always", [
            'feat',
            'ci',
            'build',
            'chore',
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
