import { ReturnButton } from "../components/ReturnButton"

export const About = () => {
  return (
     <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4">
    <div className="absolute top-6 left-6">
        <ReturnButton />
      <div className="pt-2">
        <h1 className>
          About
        </h1>
      </div>
    </div>
    </div>
  )
}
