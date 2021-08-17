interface Props {
  visualizeAlgorithm: () => void;
  clearBoard: () => void;
  disableButtons: boolean;
}

const Nav: React.FC<Props> = ({
  visualizeAlgorithm,
  clearBoard,
  disableButtons,
}) => {
  return (
    <nav className="bg-white shadow">
      <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8">
        <div className="relative flex justify-center h-16">
          <div className="my-auto space-x-4">
            <button
              onClick={visualizeAlgorithm}
              disabled={disableButtons}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2 -ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Visualize
            </button>
            <button
              onClick={clearBoard}
              disabled={disableButtons}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2 -ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Clear Board
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
