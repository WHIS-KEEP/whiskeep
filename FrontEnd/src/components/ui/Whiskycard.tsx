import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"
import examplewhisky from "../../assets/example.png"

const Whisky = [
  {
    title: "맥캘란 12년산 쉐리 오크 40%",
    description: "Single Malt | 40%",
  },
]

type CardProps = React.ComponentProps<typeof Card>

export function Whiskycard({ className, ...props }: CardProps) {
  return (
    <div className="relative">
      {" "}
      {/* 부모 relative로 설정 */}
      {/* 364px : 양쪽 패딩 17.5 일때 양 옆의 카드 가장자리의 외곽선이 안보이는 시점이라서 2장이 들어갈지 미지수 */}
      <Card className={cn("w-[170px] h-[250px] rounded-[18px]", className)} {...props}>
        <CardContent className="grid gap-4">{/* 명화 넣는 자리 */}</CardContent>
      </Card>
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-primary-dark rounded-b-[20px] flex items-end">
        {" "}
        {/* flex와 items-end 추가 */}
        <div className="p-2 w-full">
          {" "}
          {/* 내부 div에 padding과 width 추가 */}
          {Whisky.map((Whisky, index) => (
            <div key={index} className="mb-4 grid grid-cols-[160px_1fr] pb-4 last:mb-0 last:pb-0">
              <div className="space-y-4">
                {" "}
                {/* space-y 값을 줄여서 적절하게 */}
                <p className="text-sm font-medium leading-none text-white overflow-hidden whitespace-nowrap text-ellipsis">{Whisky.title}</p>
                <div className="space-y-2 gridgrid-cols-[130px_1fr]">
                  <p className="text-xs text-white overflow-hidden whitespace-nowrap text-ellipsis">{Whisky.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 하단배경 부분 */}
        {/* 25.03.26. 여기까지 하다. 27은 여기부터 시작 */}
        <div className="w-[4px] h-[54px] rounded-full flex justify-center items-center shadow-lg">
          <Heart className="size-5 absolute top-19 right-2 text-red-500" fill="red" />
        </div>
      </div>
    </div>
  )
}

export default Whiskycard
