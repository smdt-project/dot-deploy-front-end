import { useSelector } from "react-redux";

const Versions = () => {
  const { project } = useSelector((state) => state.project);
  const { code } = project;

  if (!code || code.length === 0) {
    return (
      <div className="p-4 text-slate-400 text-sm">No versions available.</div>
    );
  }
  return (
    <div className="p-4 text-slate-300">
      <h2 className="text-sm uppercase text-slate-500 mb-4">Versions</h2>
      <div className="space-y-4">
        {code.map((version, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {index !== code.length - 1 && (
                <div className="w-px h-8 bg-slate-500"></div>
              )}
            </div>

            <div className="flex-1 p-3 bg-slate-700 rounded-md">
              <div className="text-sm text-slate-400 mb-2">
                Version {code[0].version}
              </div>
              <div className="text-sm text-slate-300">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      html: version.html,
                      css: version.css,
                      js: version.js,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Versions;
