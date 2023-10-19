"use client";
import { useState  , useCallback} from "react";
import { data } from "@/constants/index";
import { useRef } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response,setResponse]  = useState([]);
  const scrollRef = useRef(null);

  const scrollToId = (id : any) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  const handleSendImage = useCallback(() => {
    if (selectedImage) {
      setIsLoading(true);
      const delay = 2000; // 2 seconds

      setTimeout(() => {
        fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: JSON.stringify({ image: selectedImage }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setIsModalOpen(true);
            setResponse(data.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error sending image:", error);
            setIsLoading(false);
          });
      }, delay);
    }
  }, [selectedImage]);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);
  return (
    <main className="h-full animated-bg">
      <div className="flex flex-col justify-center items-center">
        <div className="w-3/4 p-4 mx-auto">
          <h1 className="text-center p-3 text-3xl font-bold mb-10 rainbow-text drop-shadow-xl">เขาว่าสายตามันหลอกกันไม่ได้</h1>
          <div className="grid grid-cols-4 gap-4">
            {data.map((image, index) => (
              <button onClick={() => scrollToId('selected')}>
              <img
                key={index}
                src={image}

                className={`w-[200px] h-[200px] mx-auto object-cover drop-shadow-xl cursor-pointer ${
                  selectedImage === image ? "border-4 border-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              />
              </button>
            ))}
          </div>
        </div>
        <div className="w-1/2 my-[200px] pb-[300px] flex flex-col" ref={scrollRef}  id="selected">
        <h1 className="text-center p-3 text-3xl font-bold mb-10 rainbow-text drop-shadow-xl" >Selected Image:</h1>
          {selectedImage && (
            <img src={selectedImage} alt="Selected Image" className="w-[400px] h-[400px] mx-auto mt-[50px] object-cover rounded-lg shadow-lg" />
          )}
          {selectedImage && (
            <button
              onClick={handleSendImage}
              className="mt-4 px-4 py-2 bg-blue-500 text-white mx-auto rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Analysis'
              )}
            </button>
          )}
          {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Analysis Result
                    </h3>
                    <div className="mt-2">
                      {/* Add your analysis result content here */}
                      <p className="text-sm text-gray-500">
                        {response && response.map((item,index) => (
                          <p key={index}>{index+1} : {item}</p>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </main>
  );
}
