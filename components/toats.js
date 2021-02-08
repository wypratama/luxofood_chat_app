export default function Toast({ alert }) {
  return (
    <div className="flex fixed bottom-12 w-11/12 max-w-sm mx-auto overflow-hidden bg-primary rounded-lg shadow-md">
      <div className="w-2 bg-alternative"></div>

      <div className="flex items-center px-2 py-3">
        <img
          className="object-cover w-10 h-10 rounded-full"
          alt="User avatar"
          src={alert.user.image}
        />

        <div className="mx-3 text-xs">
          <p className="text-bg dark:text-gray-200">
            {alert.user.name + ' ' + alert.msg}.
          </p>
        </div>
      </div>
    </div>
  );
}
