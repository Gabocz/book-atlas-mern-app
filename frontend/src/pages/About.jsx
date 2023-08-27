function About() {
  return (
    <div className="content mt-3">
      <article className="message has-background-grey-lighter">
        <div className="message-body title is-size-5-mobile is-size-5-tablet is-size-3-desktop is-italic">
          A jó könyv mindenkinek mást jelent...
        </div>
      </article>
      <div className="block">Mi azt gondoljuk, hogy ez jó dolog.</div>
      <div className="block">
        Azt is hisszük, hogy az igényes könyvtár kialakításához{" "}
        <strong>nincs szükség </strong>
        sok pénzre, sem újabb erdők kivágására,{" "}
        <strong>környezetszennyező</strong>,<strong> energiaigényes</strong>{" "}
        technológiákra.
      </div>
      <div className="block">
        A könyvek, amik megváltoztatják az életed, vagy amik kényelmes kuckóddá
        válhatnak, már léteznek valahol. Csak{" "}
        <strong className="is-italic">
          nem tudják, hogy pont őket keresed
        </strong>
        .
      </div>
      <div className="block">
        A <strong>BookAtlas</strong> egy olyan hely, ahová feltöltheted a még jó
        állapotú, de már feleslegessé vált könyveidet, és megnézheted, mások
        milyen könyveket szeretnének elajándékozni, illetve elcserélni.
      </div>
      <div className="block">
        A <strong>keresővel</strong> böngészhetsz az adatbázisunkban.
      </div>
      <div className="block">
        A <strong>térkép</strong> segítségével megnézheted, milyen könyvek
        vannak a közeledben, és a honlapon keresztül felveheted a kapcsolatot a
        könyv tulajdonosával.
      </div>
      <div className="block">
        Így kialakíthatod a <strong>saját könyvtáradat</strong>, ami a te
        ízlésedet tükrözi.
      </div>
      <div className="block">Kellemes böngészést! Ne feledd:</div>
      <article className="message box">
        <div className="message-body is-size-6-mobile is-size-5">
          Mindenkire vár egy könyv valahol!
        </div>
      </article>
      <div className="block">
        <small className="mt-3 is-italic">
          * Az oldalt folyamatosan fejlesztjük és bővítjük, ezért látogass
          vissza gyakran!
        </small>
      </div>
    </div>
  );
}

export default About;
