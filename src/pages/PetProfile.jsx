import { ReturnButton } from "../components/ReturnButton"
export const PetProfile = () => {
  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gray-100 px-4">
    <div className ="absolute top-6 left-6"> 
      <ReturnButton />
      </div>
    <div className="pt-17">PetProfile</div>
    </div>
  )
}
