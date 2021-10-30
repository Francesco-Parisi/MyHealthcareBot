# MyHealthcareBot 🤖

## Descrizione
![Descrizione ](images/home.png)
A seguito dell’emergenza sanitaria causata dal coronavirus, il governo e le autorità sanitarie hanno disposto misure restrittive a tutta la popolazione, stabilendo il divieto di assembramenti e il mantenimento di distanze di sicurezza. In un periodo come questo, dove l’epidemia dilaga, sarebbe importante soprattutto all’interno delle strutture sanitarie, oltre ad indossare la mascherina e a disinfettare frequentemente le mani, garantire il corretto distanziamento di personale medico e pazienti. 

Per permettere tutto ciò fondamentale è l’organizzazione, in maniera tale da differenziare gli appuntamenti per orario ed evitare così le code. La soluzione è quella di realizzare un bot che fornisca supporto alle strutture sanitarie, così da gestire in maniera efficiente le prenotazioni di visite mediche da parte dei pazienti e organizzandole in diverse fasce orarie. 
***

## Idea
L’idea è stata quella di sviluppare MyHealthcarebot fornendo all’utente diverse importanti funzionalità, tra cui:

• **Informazioni sulle strutture Sanitarie**: Il paziente ha la possibilità di chiedere al bot informazioni su una specifica struttura e ottenere tutte le informazioni di cui necessita.

• **Informazioni sui Dottori**: Il paziente ha la possibilità di chiedere informazioni relative ai dottori appartenenti ad una certa struttura sanitaria, questo al fine di avere un quadro generale chiaro per poi poter effetturare delle prenotazioni.

• **Prenotazione Visita**: Il paziente, conoscendo le strutture sanitarie, i dottori e le patologie da loro trattate, ha la possibilità di prenotare uno slot orario di una visita specialistica tra quelli messi a disposizione.

• **Area Admin**: L’amministratore della struttura sanitaria ha a disposizione un’area riservata, accessibile solo dopo essersi autenticato con le credenziali che gli sono state fornite dalla struttura stessa. Una volta autenticato, l’amministratore può visualizzare le prenotazioni fatte dai pazienti della struttura oppure annullare le visite dei dottori.

## Architettura
L’architettura di MyHealtcareBot è caratterizzata dall’utilizzo di diversi servizi:

![Architettura ](images/architecture1.png)

• **Azure App Service**: Un servizio utilizzato non solo per ospitare il bot, ma soprattutto per ospitare l’app web necessaria per l’autenticazione dell’amministratore di struttura. Permette di creare e distribuire rapidamente le app, tramite la possibilità di utilizzare uno dei tanti linguaggi di programmazione supportati, in questo caso Node.js, garantendo affidabilità, alte prestazioni e bilanciamento del carico.

• **Azure Bot service**: Questo servizio è essenziale per la creazione del bot, poichè ne consente lo sviluppo rapido e intelligente basato su Microsoft Bot framework, il tutto eseguito in un ambiente serverless su Azure. Permette di creare, gestire e connettere il bot interagendo in maniera naturale con I pazienti. Il canale scelto per consentire ai pazienti di comunicare con il bot è telegram, principalmente per la sua facilità d’uso e la per sua popolarità.

• **LUIS**: Un servizio di intelligenza artificiale con lo scopo di applicare tecniche di machine learning a conversazioni in linguaggio naturale in modo da poter capire gli obiettivi dell’utente. LUIS permette allo sviluppatore di creare un modello linguistico caratterizzato da esempi di possibili domande che possono essere poste dai pazienti, al fine di interpretare correttamente le domande e quindi estrarre le informazioni richieste.

• **Azure Function**: Fondamentale per l’invio delle e-mail e per l’aggiornamento dei dati all’interno del database. Azure Function offre funzionalità di calcolo serverless che permette allo sviluppatore di scrivere meno codice, gestire un’infrastruttura meno complessa e risparmiare sui costi. Per MyHealthcareBot si è pensato di utilizzare un Http Trigger. In questo modo la funzione viene eseguita al momento della conferma della prenotazione, in cui le informazioni inserite dal paziente vengono elaborate dalla funzione stessa, la quale si occupa dell’invio della relativa e-mail. Oltre ad un Http Trigger è stato utilizzato un Timer trigger per eseguire la funzione in maniera schedulata, garantendo il corretto aggiornamento delle informazioni all’interno del database (in particolare le date delle visite)a un intervallo di tempo specificato.

• **Azure Cosmos Database**: Si tratta di un database NoSQL caratterizzato da tempi di risposta in millisecondi e scalabilità automatica ed immediata, garantendo una velocità ottimale su larga scala e scalabilità delle risorse di archiviazione. Grazie all’utilizzo dell’API per MongoDB, sono state create diverse collezioni, ognuna relativa ad un certo contesto, tra cui: dottori, amministratori, prenotazioni e strutture sanitarie. Questo ha permesso di poter richiedere le informazioni dei record presenti all’interno delle collezioni semplicemente effettuando delle query lato codice, quindi eseguendo rapidamente operazioni di lettura e scrittura. Alcune delle operazioni svolte dal bot, come l’accesso alle informazioni di un dottore, il login dell’amministratore e le prenotazioni delle visite sono possibili solo grazie a specifiche query che permettono di ottenere tutte le informazioni richieste.

![Architettura ](images/architecture2.png)

• **Blob Storage**: Tale servizio è stato utilizzato per l’archiviazione dei QR-code, i quali vengono generati e archiviati sottoforma di immagini.

• **Azure Logic App**: A causa dell’elevato numero di prenotazioni e di conseguenza dell’elevato numero di immagini archiviate, si è pensato di usufruire di un servizio che ne permettesse l’eliminazione dopo un certo periodo di tempo, ottimizzando così lo spazio di archiviazione. Azure Logic App è una piattaforma per la creazione e l’esecuzione di flussi di lavoro automatizzati, garantendo soluzioni altamente scalabili. Per poter eliminare le immagini archiviate è stato necessario progettare la Logic app in modo da rendere il processo del tutto automatizzato. Si è partito dalla sua ricorrenza di attivazione, in questo caso specificando l’orario e un giorno della settimana in cui la Logic app deve essere eseguita, poi è stata creata una connessione API, che ha consentito di connettere la Logic app al servizio di archiviazione BlobStorage, in particolare alla cartella public contenente le immagini da eliminare.
altamente scalabili. Per poter eliminare le immagini archiviate è stato necessario progettare la Logic app in modo da rendere il processo del tutto automatizzato. Si è partito dalla sua ricorrenza

## Sviluppi Futuri

• Collegare il bot a più piattaforme come Facebook e altri.

• Migliorare l’esperienza di utilizzo, rendendo il bot ancora più semplice e intuitivo.

• Migliorare l’intelligenza, in modo da riuscire a rispondere in maniera precisa alle esigenze del paziente.

• Introdurre la possibilità di pagamento del ticket sanitario, riducendo ulteriormente i tempi di attesa in struttura.
***
## Prerequisiti

• **Sottoscrizione a Microsoft Azure**: (https://portal.azure.com)

• **Azure CLI**

• **Bot Framework Emulator**

• **Ngrok**

• **Node.js** (https://nodejs.org/en/download/current/)

• **Visual Studio Code con Estensioni** (App Service, Azure Tools, Storage, Account, Functions, Resources)

## Installazione

Per prima cosa, clonare il repository e installare i moduli da terminale tramite il seguente comando:
```sh
npm install
```
## Servizi Bot
Per procedere con la configurazione:

1. Accedere a Azure Portal e cercare Servizi Bot
2. Scegliere Azure Bot tra i vari modelli presenti
3. Selezionare Crea
4. Inserire L'handle del bot (nome univoco)
5. Creare gruppo di risorse, inserendo il nome scelto
6. Selezionare come posizione del gruppo di risorse Europa Occidentale (Questo per ogni risorsa che si andrà a creare)
7. Selezionare Crea nuovo ID app Microsoft e cliccare su rivedi e crea

## Channels 
Per connettere il Bot a Telegram, semplicemente seleziona la piattaforma scelta e immettere il token di accesso. In tal caso, per ottenere il token bisogna:

1. Accedere a Telegram e cercare BotFather 
2. Dal menù scegliere Crate a new bot e inserire il nome scelto
3. Conclusa la creazione del bot selezionare /mybots e scegliere il bot appena creato
4. Dal menù appena aperto selezionare API Token e copiare il token che viene visualizzato
5. Incollare all'interno della sezione Channels al momento della richiesta del token

## Blob Storage
Per archiviare le immagini, ricercare il servizio Account di archiviazione, cliccare crea e inserire il Nome account di archiviazione, scegliere la Posizione (Europa Occidentale) e cliccare su rivedi e crea. A questo punto, dopo aver creato l'account di archiviazione contenitore appena creato:

1. Seleziona Servizio Blob
2. Crea Contenitore
3. Inserire il nome del contenitore blob
4. Selezionare come livello di accesso pubblico in BLOB

Per archiviare immagini è necessario utilizzare una stringa di connessione, da copiare nel file .env. Tale stringa è disponibile nella sezione "Chiavi di Accesso".

## LUIS

Per configurare LUIS effettua il login al portale dedicato: <https://www.luis.ai/>.

Una volta effettuato l'accesso è necessario creare un app LUIS, per questo bisogna:

1. Cliccare New app
2. Inserire il nome dell'app e scegliere come Culture Italian
3. Una volta creata l'app è possibile creare gli intent, necessari per interpretare il linguaggio comune e di seguito apprendere l'obiettivo dell'utente.
4. Cliccare sul bottone New della sezione Intent ed inserire il nome corrente.
5. Una volta creato l'intent è possibile aggiungere delle frasi, necessare per permetterne l'addestramento del modello
6. Inserite tutte le frasi, cliccare su Train per addestre correttamente il modello
7. A questo punto è possibile anche testare il modello appena addestrato semplicemente cliccando su Test e inserire delle frasi di prova
8. Dopo aver addestrato e testato il modello, cliccare su Publish e scegliere l’opzione Production Slot
9. Terminata la pubblicazione, sarà possibile copiare l'endpoint url da inserire all'interno del file .env

Per utilizzare il servizio è necessario copiare il LuisAPIHostName, LuisAPIKey, e LuisAppId presenti sulla stessa piattaforma e incollari nel file .env

## Function App

Per creare la Function app, ricercare dalla Home di Azure "App per le funzioni" e svolgere i seguenti passaggi:

1. Selezionare il Gruppo di Risorse esistente, oppure creane uno nuovo
2. Inserire il nome della function app da creare
3. Selezionare Node.js come stack di runtime
4. Selezionare come versione la 14 LTS
5. Scegliere Europa Occidentale come Area
6. Cliccare Avati:Hosting
7. Selezionare l'account di archiviazione se esistente
8. Scegliere Linux come sistema operativo
9. Scegliere come Tipo di piano quello a Consumo (Serverless)
10. Clicca su crea per confermare la creazione

Una volta creata la Function App sarà possibile creare una funzione, in tal caso HTTP Trigger e Time Trigger. 
Per accedere alla Console Kudu per eventuali settaggi della Function app accedere al link:
```sh
https://<FunctionAppName>.scm.azurewebsites.net
```
Una volta scelto 'Debug Console' -> 'CMD' svolgere i seguenti passi:
```sh
cd site/wwwroot
npm install
npm install nodemailer
```
Questo permetterà di installare il modulo nodemailer, necessario per l'invio dell'email tramite l'esecuzione dell'HTTP Trigger. 
Sempre dalla Function App creata, recarsi nella sezione "Configurazione" per settare il corretto fuso orario. Eseguire i vari passaggi:

1. Cliccare sul bottone "Nuova impostazione applicazione" 
2. Nel campo Nome inserire WEBSITE_TIME_ZONE
3. Nel campo Valore inserire W. Europe Standard Time
4. Cliccare su Ok per confermare

Per utilizzare correttamente La Function App, recarsi in Funzioni, scegliere la funzione di interesse e cliccare su "Recupera URL della Funzione". Una volta copiato, l'url va incollato nel file .env

## Azure Cosmos Database
Per creare il database, selezionare Azure Cosmos Db e scegliere Azure Cosmos DB API for MongoDB. A questo punto procedere con i seguenti passaggi:

1. Selezionare il Gruppo di Risorse esistente
2. Immettere il nome dell'Account
3. Scegliere come Posizione Europa Occidentale
4. Cliccare su Rivedi e crea e concludere la creazione
5. Spstarsi nella sezione Esplora dati all'interno di Cosmos Db
6. Cliccare sul bottone "New Database"
7. Inserire un Database id

Una volta creato il Database è possibile creare diverse collezioni. Per creare una collezione:
1. Clicca sul bottone "New Collection"
2. Seleziona in Database Name "Use existing" e scegliere il database esistente
3. Inserire il nome della collezione
4. Cliccare su Ok

Ora all'interno di una collezione è possibile accedere in Document e inserire le informazioni necessarie, creando in tutta semplicità dei record in formato json.

A questo punto per utilizzare le API di Cosmos Db spostarsi nella sezione Stringa di Connessione e copiare "STRINGA DI CONNESSIONE PRIMARIA", da incollare nel file config.js

## Deploy
Per poter testare il bot appena creato occore effettuare il deploy:
1. Eseguire il deploy della web app utilizzando l'estensione per Visual Studio Code
2. Assicurarsi che l'endpoint del servizio bot sia corretto e che il Servizio App associato sia in esecuzione
3. Una volta concluso correttamente il deploy è possibile testare il bot utilizzando Telegram o la web chat su Azure
***

## Riferimenti

• **Microsoft Bot Framework**: https://dev.botframework.com/

• **Cards**: https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-reference

• **LUIS** https://azure.microsoft.com/it-it/services/cognitive-services/language-understanding-intelligent-service/#overview

• **Adaptive Cards**: https://docs.microsoft.com/en-us/adaptive-cards/

• **Function App** https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview

• **Comandi**: https://it.tele.wiki/telegram/botfather?s[]=commands

• **Infrastruttura globale**: https://azure.microsoft.com/it-it/global-infrastructure/

• **Vantaggi di Azure**: https://azure.microsoft.com/it-it/overview/azure-vs-aws/
