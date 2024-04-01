export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="inline-flex items-center"
        data-testid="404-error-page-text"
      >
        <p className="mr-6 border-r border-gray-400 pr-6 font-sans text-2xl font-semibold leading-[49px]">
          404
        </p>
        <div>
          <p>Страница не найдена</p>
        </div>
      </div>
    </div>
  );
}
