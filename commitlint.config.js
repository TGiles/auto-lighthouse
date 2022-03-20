module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "type-enum": [2, "always", [
            'build',
            'feat',
            'ci',
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
