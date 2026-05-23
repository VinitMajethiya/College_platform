import { CollegesClient } from "@/components/college/CollegesClient";
import { listColleges } from "@/lib/college-service";
import { collegeListQuerySchema } from "@/lib/validations/college";

export default async function CollegesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(",") : value ?? ""
    ])
  );
  
  const query = collegeListQuerySchema.parse(params);
  const result = await listColleges(query);

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <CollegesClient colleges={result.colleges} pagination={result.pagination} />
    </main>
  );
}
