import { useSelector, useDispatch } from "react-redux";
import { selectVersion } from "../../projectSlice";

const Versions = () => {
  const { versions = [], selectedVersion } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  const handleSelectVersion = (version) => {
    dispatch(selectVersion(version));
  };

  const getVersionColor = (index, version) => {
    if (selectedVersion === version.version) return "bg-green-500";
    const colors = ["bg-blue-500"];
    return colors[index % colors.length];
  };
if (!Array.isArray(versions) || versions.length === 0) {
  return <div className="p-4 text-slate-400 text-sm">No versions available.</div>;
}
  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-xs uppercase text-slate-400 font-semibold mb-4 tracking-wider">
        Versions
      </h2>
      <div className="relative space-y-3">
        {versions.map((version, index) => (
          <div
            key={index}
            className={`relative flex items-center space-x-2 cursor-pointer rounded-md 
              ${selectedVersion?.version === version.version ? "bg-slate-700 text-white" : "hover:bg-slate-800 hover:bg-opacity-50"}`}
            onClick={() => handleSelectVersion(version)}
          >
            {index !== versions.length && (
              <div className="absolute left-[0.7rem] w-px h-5 bg-slate-600 top-4"></div>
            )}
            <div
              className={`w-2 h-2 rounded-full ${getVersionColor(index, version)}`}
            ></div>
            <span
              className={`text-sm ${selectedVersion?.version === version.version ? "font-semibold" : "text-slate-300 ml-6"}`}
            >
              Version {version.version}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Versions;
