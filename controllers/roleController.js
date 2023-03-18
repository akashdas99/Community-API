const Role = require("../models/role");
const validator = require("validator");

exports.getRole = async (req, res) => {
  const roles = await Role.paginate(
    {},
    {
      page: 1,
      limit: 10,
    }
  );

  return res.status(200).json({
    status: true,
    content: {
      meta: {
        total: roles.totalDocs,
        pages: roles.totalPages,
        page: roles.page,
      },
      data: roles.docs,
    },
  });
};

exports.createRole = async (req, res) => {
  try {
    let errors = [];
    const { name } = req.body;

    if (!validator.isLength(name, { min: 2 })) {
      errors.push({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    if (errors.length !== 0)
      return res.status(400).json({
        status: false,
        errors: errors,
      });

    const roleAvailable = await Role.findOne({ name });

    if (roleAvailable) {
      return res.status(409).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }
    const scope =
      name === "Community Admin"
        ? ["member-get", "member-add", "member-remove"]
        : ["member-get"];
    console.log(scope);

    const role = await Role.create({
      name,
      scope,
    });
    res.status(201).json({
      status: true,
      content: {
        data: {
          id: role._id,
          name: role.name,
          created_at: role.createdAt,
          updated_at: role.updatedAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
