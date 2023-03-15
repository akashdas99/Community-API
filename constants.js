exports.constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
exports.scopes = {
  "Community Admin": ["member-get", "member-add", "member-remove"],
  "Community Member": ["member-get"],
  "Community Moderator": ["member-get", "member-remove"],
};
