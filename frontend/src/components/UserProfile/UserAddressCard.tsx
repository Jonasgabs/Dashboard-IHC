import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserAddressCard() {

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Nota
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Apresentação
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  100
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Desenvolvimento
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  100
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Esforço da Equipe
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  100
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Vale 100?
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Valeu pelo esforço
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
