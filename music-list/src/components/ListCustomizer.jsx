export default function ListCustomizer(){
  /*
    There's not much here yet, but this is where the logic adding the rules / constraints (ex. one song per album) will go. For now it's just an input where you can name your list, and a placeholder h1 for the Rules.
  */

  return (
    <div className="flex items-center mx-2 bg-cyan-300 justify-between h-20 my-4 rounded-2xl p-5">
      <input className="text-2xl border-2 rounded-2xl p-2" type="text" placeholder="My List"/>
      <h1 className="text-2xl">Rules</h1>
    </div>
  )
}