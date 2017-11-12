### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| app/routes.js | 25 | Webpack lazy loading?
| app/stores/auth.js | 71 | If this fails then the JWT cookie is cleared and a new user will be created. is this ok?
| server/services/encrypt-user.js | 6 | createCipheriv should be used
| server/services/generate-prompt.js | 77 | Should be cleared periodically as well for users that never completed the process