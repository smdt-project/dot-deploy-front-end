import { useSelector } from "react-redux";

const Versions = () => {
  const { versions } = useSelector((state) => state.project);

  if (!versions || versions.length === 0) {
    return (
      <div className="p-4 text-slate-400 text-sm">No versions available.</div>
    );
  }

  return (
    <div className="p-4 text-slate-300">
      <h2 className="text-sm uppercase text-slate-500 mb-2">Versions</h2>
      <ul className="space-y-2">
        {versions.map((version, index) => (
          <li key={index} className="p-2 bg-slate-700 rounded-md text-sm">
            {version}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Versions;
