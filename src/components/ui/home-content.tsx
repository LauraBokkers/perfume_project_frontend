export const HomeContent = () => {
  return (
    <div className="p-8 bg-custom-table rounded-xl flex flex-col gap-4 font-sans items-center">
      <h1 className="font-semibold">Over dit project: </h1>
      <p>
        Deze webapplicatie is gemaakt als portfolio project door mij -{" "}
        <b>Laura Bokkers</b>. Het idee is om een CRUD app te bouwen voor een van
        mijn hobbies en daarmee te laten zien dat ik zowel front-end als
        back-end kennis heb, en dit kan deployen en beheren.
      </p>
      <p>
        Omdat het mijn ambitie is om parfum te leren maken, leek het me leuk om
        die hobby te combineren met coderen. Deze app is een tool om parfums mee
        te formuleren. Onder de tab ‘Aromachemicals’ vind je alle grondstoffen
        met hun eigenschappen. Deze kun je gebruiken om een formulering te
        maken, die je vindt onder ‘Formulations’. Het is ook mogelijk om
        geurcategorieën aan te passen of toe te voegen.
      </p>
      <p>
        {" "}
        De front-end is geschreven in <b>Typescript</b> met <b>React</b> (
        <b>Vite</b>), <b>Tailwind</b> voor styling en <b>ShadCN</b> voor
        basis-componenten. De back-end is geschreven in <b>Typescript</b> met{" "}
        <b>NestJS</b> en <b>Prisma</b> als ORM en een <b>Postgres</b> database.
      </p>
      <p>
        De front-end is gedeployed en gehost met <b>Vercel</b> en de back-end en
        database met <b>Railway</b>. De app is ontworpen om responsive te zijn,
        maar voor de beste gebruikerservaring raad ik aan om deze op een groter
        scherm te bekijken.
      </p>
    </div>
  );
};
