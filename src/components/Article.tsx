import dayjs from "dayjs";
import Image from "next/image";
import { Banner } from "./Banner";
import { PostPhotosSchema, PostsSchemaType } from "@/utils/zod-schema";

export function Article({ article }: { article: PostsSchemaType[0] }) {
  const photos = PostPhotosSchema.parse(article?.photosWithMeta);

  return (
    <div>
      {article?.header ? (
        <div className="flex justify-center">
          <div
            className={`text-gray-900 mt-7 my-4 px-3 md:px-5 font-semibold text-3xl md:text-4xl md:text-center md:max-w-5xl [&>span]:font-light`}
            dangerouslySetInnerHTML={{ __html: article?.header }}
          />
        </div>
      ) : null}

      {article?.date ? (
        <>
          <div
            className={`flex flex-col justify-center md:flex-row text-gray-600 my-5 min-w-full px-3 md:px-5 md:max-w-lg md:text-center`}
          >
            <a
              href={article?.currentLink ?? undefined}
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              <time dateTime={new Date(article?.date).toISOString()}>
                {dayjs(article?.date).format("MMMM DD, YYYY")}
              </time>
            </a>
            <a
              href="https://meduza.io"
              target="_blank"
              rel="noopener"
              className="md:ml-2 hover:underline"
            >
              Источник: Meduza
            </a>
          </div>
        </>
      ) : null}
      {photos?.map((photo, index) => {
        if (!photo?.img) {
          return <p key={photo?.img}>no image</p>;
        }
        return (
          <div key={photo?.img}>
            {photo?.title?.map((title) => {
              return (
                <div key={title} className="flex justify-center">
                  <div
                    className={`text-gray-900 mt-16 my-2 px-3 md:px-5 min-w-full font-semibold text-3xl md:text-4xl md:min-w-[672px] md:max-w-2xl`}
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                </div>
              );
            })}

            {photo?.subTitle?.map((subTitle) => {
              const isSensitive = subTitle.includes("SensitiveBlock-");

              if (isSensitive) {
                return null;
              }

              return (
                <div key={subTitle} className="flex justify-center">
                  <div
                    className={`text-gray-900 my-7 px-3 md:px-5 text-xl [&_a]:text-blue-600 [&_a]:underline md:min-w-[672px] md:max-w-2xl`}
                    dangerouslySetInnerHTML={{ __html: subTitle }}
                  />
                </div>
              );
            })}

            {index === 0 ? (
              <Banner>
                <p>
                  <span className="font-bold">Осторожно!</span> Некоторые
                  фотографии содержат сцены жестокости, насилия и смерти.
                  Призываем впечатлительных читателей не смотреть фото.
                </p>
              </Banner>
            ) : null}
            <div className="relative w-full h-[500px] md:h-[900px] mt-10 mb-4 bg-gray-200">
              <a
                href={photo?.img}
                target="_blank"
                rel="noopener"
                title="Click to view full image"
              >
                <Image
                  src={photo?.img}
                  fill
                  priority={index < 5}
                  quality={85}
                  alt={photo?.captionText ?? ""}
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </a>
            </div>
            {photo?.captionText ? (
              <div className="flex justify-center">
                <div
                  className={`text-gray-900 px-3 md:px-5 min-w-full md:min-w-[672px] md:max-w-2xl [&_a]:text-blue-600 [&_a]:underline`}
                  dangerouslySetInnerHTML={{ __html: photo?.captionText }}
                />
              </div>
            ) : null}
            {photo?.credit ? (
              <div className="flex justify-center">
                <div
                  className={`text-gray-500 mb-2 mt-1.5 px-3 md:px-5 min-w-full md:min-w-[672px] md:max-w-2xl`}
                  dangerouslySetInnerHTML={{ __html: photo?.credit }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
