export async function check_dir(dir: string) {
    try {
        const misc_info = await Deno.stat(dir);
        if (!misc_info.isDirectory) {
            console.error(`Error: ${dir} exists but is not a directory`);
            return -1;
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            // Directory does not exist, create it
            try {
                await Deno.mkdir(dir, { recursive: true });
                console.log(`Directory created: ${dir}`);
            } catch (mkdirErr) {
                console.error(`Error creating directory: ${mkdirErr.message}`);
                return -1;
            }
        } else {
            console.error(`Error accessing directory: ${err.message}`);
            return -1;
        }
    }
    return 0;
}

// Function to clean the directory
export async function clean_dir(dir: string) {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const path = `${dir}/${entry.name}`;
        await Deno.remove(path, { recursive: true }); // Remove files/directories
      }
      return true;
    } catch (err) {
      console.error("Cleanup error:", err);
      return false;
    }
  }