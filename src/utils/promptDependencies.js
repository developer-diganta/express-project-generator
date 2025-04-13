const { search, confirm } = require('@inquirer/prompts');

 const promptDependencies = async () => {
  let additionalDeps = ["express", "dotenv","cors"];

  let continueAdding = true;

  while (continueAdding) {
    const selectedDeps = await search({
      message:
        "Select one or more npm packages (use comma-separated input or multiple selections):",
      multiple: true, // Allows multiple selections
      source: async (input, { signal }) => {
        if (!input) {
          return [];
        }

        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(
            input
          )}&size=20`,
          { signal }
        );
        const data = await response.json();

        return data.objects.map((pkg) => ({
          name: `${pkg.package.name} - ${pkg.package.description}`,
          value: pkg.package.name,
        }));
      },
    });
    console.log(selectedDeps)

    // Add the selected dependencies to the list
    additionalDeps = additionalDeps.concat(selectedDeps);

    // Ask if the user wants to add more dependencies
    continueAdding = await confirm({
      message: "Would you like to add more dependencies?",
    });
  }
  console.log(additionalDeps)
  return additionalDeps.filter((dep) => dep); // Return all selected dependencies
};

module.exports = { promptDependencies };
