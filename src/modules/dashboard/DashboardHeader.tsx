import { faker } from "@faker-js/faker";

const DashboardHeader = () => {
  const avatar = faker.image.avatar();
  return (
    <div className="h-10 w-full bg-white border-b-[0.5px] border-slate-200">
      <div className="flex h-full w-full">
        <div className="flex-1 flex justify-start mr-auto items-center cursor-pointer">
          <img src="/new-logo-min.png" className="h-5 w-5 mr-1 ml-5" />
          <div className="font-bold text-lg">Advaita</div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {/* <div className="font-bold text-lg">Advaita</div> */}
        </div>
        <div className="flex-1 flex justify-end ml-auto items-center">
          <img
            src={avatar}
            className="h-8 w-8 mr-5 rounded-full border border-slate-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
