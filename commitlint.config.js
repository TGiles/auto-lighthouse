module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "type-enum": [2, "always", [
            'build',
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
