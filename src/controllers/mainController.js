import routes from "../routes";

export const home = (req, res) => {
  res.render("Home", { title: "3D Loader" });
};

export const objLoader = (req, res) => {
  res.render("ObjLoader", { title: "OBJ Loader" });
};

export const gltfLoader = (req, res) => {
  res.render("GltfLoader", { title: "GLTF Loader" });
};
