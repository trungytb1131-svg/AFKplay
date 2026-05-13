import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../components/builder";

// Khởi tạo Builder với API Key từ file .env
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// CHỈNH SỬA: params phải được khai báo là một Promise để phù hợp với Next.js 16
interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

export default async function Page(props: PageProps) {
  // CHỈNH SỬA: Phải dùng 'await' để lấy dữ liệu từ params trước khi sử dụng
  const { page } = await props.params;
  
  const builderModelName = "figma-imports";

  const content = await builder
    .get(builderModelName, {
      userAttributes: {
        // Sử dụng mảng 'page' đã được giải nén từ await ở trên
        urlPath: "/" + (page?.join("/") || ""),
      },
    })
    .toPromise();

  return (
    <>
      {/* Render nội dung từ Builder */}
      <RenderBuilderContent content={content} model={builderModelName} />
    </>
  );
}