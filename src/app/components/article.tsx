import Image from "next/image";

import { ArticleDate } from "@/ui/article-date";
import { Banner } from "@/ui/banner";

import { PostPhotosSchema } from "@/utils/zod-schema";

import type { PostsSchemaType } from "@/utils/zod-schema";

export function Article({ article }: { article: PostsSchemaType[0] }) {
  const photos = PostPhotosSchema.parse(article?.photosWithMeta);

  return (
    <div className="">
      {article?.header ? (
        <div className="flex justify-center">
          <div
            data-testid="article-header"
            className={`my-4 mt-7 max-w-full break-words px-3 text-3xl font-semibold text-gray-900 md:max-w-5xl md:px-5 md:text-center md:text-4xl [&>span]:font-light`}
            dangerouslySetInnerHTML={{ __html: article?.header }}
          />
        </div>
      ) : null}

      {article?.dateString ? (
        <>
          <div
            className={`my-5 flex min-w-full flex-col justify-center gap-1 px-3 text-gray-600 md:max-w-lg md:flex-row md:px-5 md:text-center`}
          >
            <a
              href={article?.currentLink ?? undefined}
              target="_blank"
              rel="noopener"
              className="hover:underline"
              data-testid="article-date"
            >
              <ArticleDate date={article?.dateString} />
            </a>
            <span className="hidden md:block">·</span>

            <a
              href="https://meduza.io"
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              Источник: Meduza
            </a>
          </div>
        </>
      ) : null}
      <div data-testid="article-body">
        {article?.subtitle ? (
          <div className="flex justify-center">
            <div
              className={`my-7 max-w-full break-words px-3 text-xl text-gray-900 md:min-w-[672px] md:max-w-2xl md:px-5 [&_a]:text-blue-600 [&_a]:underline`}
              dangerouslySetInnerHTML={{ __html: article?.subtitle }}
            />
          </div>
        ) : null}

        <Banner>
          <p>
            <span className="font-bold">Осторожно!</span> Некоторые фотографии
            содержат сцены жестокости, насилия и смерти. Призываем
            впечатлительных читателей не смотреть фото.
          </p>
        </Banner>

        {photos?.map((photo) => {
          if (!photo?.img) {
            return <p key={photo?.img}>Изображение не найдено</p>;
          }

          return (
            <div key={photo?.img}>
              {photo?.title?.map((title) => {
                return (
                  <div key={title} className="flex justify-center">
                    <div
                      className={`my-2 mt-16 min-w-full px-3 text-3xl !font-semibold text-gray-900 md:min-w-[672px] md:max-w-2xl md:px-5 md:text-4xl`}
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
                      className={`my-7 max-w-full break-words px-3 text-xl text-gray-900 md:min-w-[672px] md:max-w-2xl md:px-5 [&_a]:text-blue-600 [&_a]:underline`}
                      dangerouslySetInnerHTML={{ __html: subTitle }}
                    />
                  </div>
                );
              })}

              <div className="relative mb-4 mt-10 h-[500px] w-full bg-gray-200 md:h-[900px]">
                <a
                  href={photo?.img}
                  target="_blank"
                  rel="noopener"
                  title="Нажмите, чтобы посмотреть оригинальное изображение"
                >
                  <Image
                    src={photo?.img}
                    fill
                    alt={photo?.captionText ?? ""}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </a>
              </div>
              {photo?.captionText ? (
                <div className="flex justify-center">
                  <div
                    className={`min-w-full break-words px-3 text-gray-900 md:min-w-[672px] md:max-w-2xl md:px-5 [&_a]:text-blue-600 [&_a]:underline`}
                    dangerouslySetInnerHTML={{ __html: photo?.captionText }}
                  />
                </div>
              ) : null}
              {photo?.credit ? (
                <div className="flex justify-center">
                  <div
                    className={`mb-2 mt-1.5 min-w-full break-words px-3 text-gray-500 md:min-w-[672px] md:max-w-2xl md:px-5`}
                    dangerouslySetInnerHTML={{ __html: photo?.credit }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
