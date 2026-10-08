# Lerntagebuch – Serverhärtung nach IT-Grundschutz

**Projekt:** Ubuntu-24.04-Cloud-Server für einen Maschinenverleih
**Ziel:** Server nach BSI IT-Grundschutz absichern, Konfiguration als Infrastructure as Code (Ansible + Git)
**Werkzeuge:** Ubuntu 24.04, WSL (Ubuntu) als Steuerrechner, Ansible 2.16, Git/GitHub, ufw, ClamAV, Docker

## Überblick

| Datum | Schwerpunkt | Ergebnis |
|---|---|---|
| 24.09.2026 | Grundschutz-Methodik, Bestandsaufnahme, Ansible-Einstieg | `ssh.yml` |
| 01.10.2026 | Git/GitHub, Firewall, Patch-Management | `firewall.yml`, `updates.yml` |
| 02.10.2026 | Benutzerverwaltung, Schutzbedarf, Virenschutz | `users.yml`, `clamav.yml` |
| 08.10.2026 | Monitoring-Auswahl, Container-Plattform | Entscheidung Zabbix, `docker.yml` |

## Einsatz von KI

**Werkzeug:** Claude (Anthropic) im Projekt „IT-Tutor“

**Wofür ich die KI eingesetzt habe:**
- Erklärungen zu Konzepten und Befehlen (z. B. Grundschutz-Methodik, SSH, ufw, Ansible, Git, Docker)
- Vorschläge für Befehle und Ansible-Playbooks, die ich Schritt für Schritt nachvollzogen habe
- Auswertung meiner Terminal-Ausgaben und Hilfe bei Fehlern
- Recherche zu Monitoring-Lösungen, Mailservern und Docker sowie Vorschlag einer Nutzwertanalyse
- Entwürfe der Dokumentation (Word) und dieses Lerntagebuchs

**Was ich selbst gemacht habe:**
- Alle Befehle und Playbooks selbst auf dem Server bzw. in WSL ausgeführt und die Ergebnisse geprüft (Probeläufe, `changed=0`, Logs, Experimente)
- Die Entscheidungen getroffen (z. B. Zabbix, Docker, Gewichtung der Nutzwertanalyse)
- Verständnisfragen der KI beantwortet und Unklarheiten nachgefragt
- Texte der KI geprüft und an meinen Lernweg angepasst

**Grenzen:** Die KI hat keinen Zugriff auf den Server. Sie kennt nur die Ausgaben, die ich ihr gezeigt habe. Bei unsicheren Angaben (z. B. Baustein-Nummern) hat sie darauf hingewiesen, dass sie im Kompendium bzw. in der offiziellen Dokumentation geprüft werden müssen.

**Meine Anweisung an den KI-Tutor (Projektanweisung):**

```text
Du bist ein geduldiger, präziser IT-Tutor. Deine Aufgabe ist es, mir zu erklären, WARUM ich
bestimmte Befehle und Aktionen ausführe und WAS sie bewirken. Ich will verstehen, nicht nur
abtippen. Antworte auf Deutsch, Fachbegriffe und Befehle bleiben im Original.

## Wichtigste Regel: Korrektheit vor Vollständigkeit
- Erfinde nichts. Nenne nur Befehle, Optionen, Parameter, Dateipfade, Ausgaben und Verhalten,
  bei denen du dir sicher bist.
- Wenn du dir bei etwas unsicher bist, sag es ausdrücklich ("Da bin ich nicht sicher, weil ...")
  und erkläre, wie ich es selbst prüfen kann (z. B. `man <befehl>`, `<befehl> --help`,
  offizielle Dokumentation).
- "Ich weiß es nicht" ist eine gute Antwort. Rate nie und fülle Wissenslücken nicht mit
  plausibel klingenden Details.
- Behaupte nie, du hättest einen Befehl ausgeführt oder eine Ausgabe gesehen, wenn das nicht
  der Fall ist. Wenn du eine Beispielausgabe zeigst, kennzeichne sie als typisches Beispiel,
  nicht als garantiertes Ergebnis.
- Befehle und Optionen unterscheiden sich je nach Betriebssystem, Shell und Version
  (Linux-Distribution, macOS, Windows/PowerShell/cmd, GNU vs. BSD). Wenn das relevant ist und
  ich es nicht gesagt habe, frage zuerst nach, statt anzunehmen.
- Bei schnell veraltendem Wissen (Versionen, Paketnamen, Menüpfade, Preise) weise darauf hin,
  dass sich das geändert haben kann, und verweise auf die offizielle Quelle.
- Wenn meine Frage auf einer falschen Annahme beruht, sag das freundlich und korrigiere sie.

## Aufbau deiner Erklärungen
Erkläre jeden Befehl bzw. jede Aktion nach diesem Schema (kürzen, wenn es bei einfachen Dingen
übertrieben wäre):
1. Ziel: Warum führt man das aus? Welches Problem löst es?
2. Befehl: Der Befehl in einem Codeblock.
3. Aufschlüsselung: Was bedeuten Befehl, Optionen und Argumente einzeln?
4. Wirkung: Was passiert im System? Was wird gelesen, geändert, erstellt oder gelöscht?
5. Erwartetes Ergebnis: Woran erkenne ich, dass es geklappt hat?
6. Risiken & Rückgängig machen: Was kann schiefgehen? Wie mache ich es rückgängig?

## Sicherheit
- Weise vor riskanten Befehlen deutlich darauf hin (z. B. `rm -rf`, `dd`, `chmod -R`, `sudo`,
  Formatieren, Registry-Änderungen, `curl ... | sh`, Firewall-/SSH-Änderungen).
- Erkläre, wofür Administratorrechte nötig sind, und empfehle sie nur, wenn sie wirklich
  gebraucht werden.
- Schlage wenn möglich zuerst eine harmlose Prüfung vor (Dry-Run, `--dry-run`, `ls` vor `rm`,
  Backup).
- Wenn ein Befehl in meiner Umgebung Daten zerstören könnte, frage nach, bevor du ihn empfiehlst.

## Lehrstil
- Passe die Tiefe an mein Niveau an. Frage im Zweifel kurz nach meinem Vorwissen.
- Erkläre zuerst das Konzept dahinter (z. B. was ein Prozess, eine Berechtigung, ein Port ist),
  dann den Befehl.
- Nutze kurze, konkrete Beispiele und Analogien, aber nur wenn sie technisch korrekt bleiben.
- Prüfe gelegentlich mit einer kurzen Rückfrage, ob ich es verstanden habe.
- Gib keine langen Befehlsketten ohne Erklärung. Zerlege sie Schritt für Schritt.

## Format
- Befehle immer in Codeblöcken, Erklärungen in klarer, knapper Sprache.
- Keine unnötigen Floskeln. Fasse dich kurz, es sei denn, ich bitte um mehr Tiefe.
```

---

## 24.09.2026 – Grundschutz verstehen und erste Härtung

### Was ich gemacht habe
- Die Vorgehensweise des IT-Grundschutzes erarbeitet: Schutzbedarf feststellen → Bausteine auswählen (Modellierung) → Anforderungen umsetzen → IT-Grundschutz-Check.
- Bestandsaufnahme mit `sudo ss -tulpn`: Von außen erreichbar ist nur SSH (Port 22). DNS (`systemd-resolved`) lauscht nur auf `127.0.0.53`, DHCP-Client wird gebraucht.
- SSH-Konfiguration mit `sudo sshd -T` geprüft: root-Login aus, nur Schlüssel-Anmeldung.
- Ansible in WSL eingerichtet (`inventory.ini`, `ansible.cfg`), Verbindung mit `ansible verleih -m ping` getestet.
- Erstes Playbook `ssh.yml`: SSH-Einstellungen in einer eigenen Datei unter `/etc/ssh/sshd_config.d/`, Prüfung mit `sshd -t`, Neuladen per Handler.

### Was ich gelernt habe
- **`0.0.0.0` vs. `127.0.0.1`:** `0.0.0.0` heißt „auf allen Netzwerkschnittstellen“ (von außen erreichbar), `127.0.0.1` nur lokal.
- **sshd: Der erste Wert gewinnt.** Dateien in `sshd_config.d/` werden vor dem Rest von `sshd_config` gelesen. Deshalb prüft man mit `sshd -T`, was *wirklich* gilt, statt in Dateien zu schauen.
- **Idempotenz:** Ein Playbook beschreibt einen Zielzustand. Beim zweiten Lauf ist `changed=0`, Handler laufen nur bei Änderungen.
- **Probelauf:** `--check --diff` zeigt, was sich ändern würde, ohne etwas zu ändern.
- Bei SSH-Änderungen immer eine zweite Sitzung offen lassen (Schutz vor Aussperren).

### Probleme und Lösungen
- **YAML-Fehler „did not find expected key“:** Ich hatte das Playbook mit Tabulatoren statt mit Leerzeichen eingerückt. YAML erlaubt zur Einrückung nur Leerzeichen. Lösung: Tabs mit `cat -A` sichtbar gemacht (sie erscheinen als `^I`) und durch Leerzeichen ersetzt. YAML ist bei Einrückung sehr streng.
- **Fehlannahme:** Ich dachte, bei sshd hat der zuletzt gesetzte Wert Vorrang. Richtig ist: der erste.

---

## 01.10.2026 – Git, Firewall und Updates

### Was ich gemacht habe
- Eigenen SSH-Schlüssel für GitHub erzeugt (`ssh-keygen -t ed25519`), in `~/.ssh/config` hinterlegt, mit `ssh -T git@github.com` getestet.
- Gruppen-Repository geklont, Ansible-Dateien im Unterordner `ansible/` abgelegt, Arbeit in Feature-Branches mit Pull Requests.
- `.gitignore` gegen versehentliches Committen von Schlüsseln und Passwortdateien angelegt.
- **Firewall (ufw):** eingehend alles blockiert, nur `22/tcp` erlaubt (IPv4 + IPv6). Vor dem Aktivieren einen „Totmannschalter“ gesetzt (`systemd-run --on-active=5min /usr/sbin/ufw disable`), damit ich mich nicht dauerhaft aussperren kann. Danach als `firewall.yml`.
- **Patch-Management:** unattended-upgrades geprüft und als `updates.yml` festgehalten.

### Was ich gelernt habe
- Git: Arbeitsverzeichnis → `git add` (Staging) → `git commit` → `git push`. `git pull` holt Änderungen anderer.
- `.gitignore` schützt nur vor Versehen; was einmal gepusht ist, gilt als kompromittiert.
- **Reihenfolge ist entscheidend:** SSH-Regel *vor* `ufw enable`, sonst sperrt man sich aus. Das gilt auch für die Task-Reihenfolge im Playbook.
- Ein Probelauf mit `changed=0` beweist, dass der Code genau den Serverzustand beschreibt.
- `unattended-upgrades.service` installiert selbst keine Updates; das machen die Timer `apt-daily.timer` und `apt-daily-upgrade.timer`.
- Automatisch kommen nur **Sicherheitsupdates** (`noble-security`). Normale Updates (`noble-updates`) spiele ich manuell ein. Ein Neustart erfolgt nicht automatisch (`/var/run/reboot-required` prüfen).
- Der stärkste Nachweis ist das Log (`/var/log/unattended-upgrades/`), nicht die Konfigurationsdatei.

### Probleme und Lösungen
- **`unknown option: --global`:** Ich hatte den Unterbefehl `config` vergessen. Ohne Unterbefehl ordnet Git `--global` sich selbst zu und kennt die Option nicht. Richtig: `git config --global user.name "…"`.
- Erst nachgeprüft, über welchen Port ich verbunden bin (`echo $SSH_CONNECTION`, `ss -tlpn`), bevor ich Firewall-Regeln setze.

---

## 02.10.2026 – Benutzer, Schutzbedarf und Virenschutz

### Was ich gemacht habe
- **`users.yml`:** Admin-Account (Gruppe `sudo`) und Developer-Account (Gruppen `users`, `devs`, kein `sudo`) mit öffentlichen SSH-Schlüsseln aus `ansible/files/`. Später einen zweiten Schlüssel für den Developer ergänzt.
- **Schutzbedarfsanalyse:** Vertraulichkeit *hoch* (personenbezogene Kundendaten, DSGVO), Integrität *normal*, Verfügbarkeit *normal* → nach Maximumprinzip Gesamtschutzbedarf *hoch*.
- Maßnahmen den Bausteinen zugeordnet: SYS.1.1, SYS.1.3, OPS.1.1.3, ORP.4, OPS.1.1.4.
- **ClamAV:** Scanner und Signatur-Updates (`freshclam`) installiert, täglicher Scan von `/home` per systemd-Timer, Test mit der EICAR-Testdatei, danach als `clamav.yml`.

### Was ich gelernt habe
- **`append: true`** beim `user`-Modul ist lebenswichtig. Ohne würde Ansible den Benutzer aus allen anderen Gruppen entfernen (z. B. `sudo` → Admin-Rechte weg).
- **Kein `exclusive: true` bei `authorized_key`:** Ohne diese Option fügt das Modul den Schlüssel nur hinzu, andere Schlüssel in `~/.ssh/authorized_keys` bleiben erhalten. Mit `exclusive: true` löscht es alle Schlüssel, die nicht im Playbook stehen. Beim eigenen Admin-Account ist das gefährlich: Ein falsch kopierter Schlüssel in `files/` würde den echten löschen, und ich wäre (ohne Notfall-Konsole) ausgesperrt. Deshalb bewusst ohne `exclusive`.
- **Relative Pfade bei `lookup`:** `lookup('file', 'files/nik.pub')` liest die Datei auf meinem Steuerrechner (WSL), ausgehend vom Ordner, in dem das Playbook liegt. Ein absoluter Pfad wie `/home/nik/<repo>/ansible/files/nik.pub` würde nur bei mir funktionieren. Bei meinen Gruppenmitgliedern liegt das Repo woanders, und das Playbook bricht mit „could not locate file“ ab. Mit `pwd` und `find . -name '*.pub'` habe ich geprüft, wo die Datei liegt.
- **Prinzip der minimalen Rechte:** Der Developer bekommt keine Admin-Rechte.
- Benutzer künftig direkt per Playbook anlegen, sonst entsteht *Configuration Drift*.
- systemd-Timer = `.service` (was) + `.timer` (wann). `Persistent=true` holt verpasste Läufe nach.
- `clamscan` meldet einen Fund mit Exit-Code 1 → Dienst `failed`. Das ist gewollt, damit Funde auffallen.
- Funde werden nicht automatisch gelöscht (Fehlalarme möglich).

### Probleme und Lösungen
- **Commit im falschen Branch:** Die Benutzerverwaltung lag versehentlich auf `ansible-updates`. Lösung: neuen Branch von `main` erstellt und den Commit mit `git cherry-pick` übernommen, alten Branch mit `git branch -D` gelöscht.
- **Ansible fand eine echte Lücke:** `clamav-freshclam` lief, war aber `disabled`, nach einem Neustart wären die Signaturen veraltet. Das Playbook hat den Dienst aktiviert.
- `ERROR: NotifyClamd` im freshclam-Log ist harmlos, weil `clamd` bewusst nicht eingesetzt wird. `clamd` ist der **Daemon** von ClamAV: ein dauerhaft laufender Dienst, der die Signaturdatenbank ständig im Arbeitsspeicher hält und Dateien auf Anfrage sehr schnell prüft. Nach jedem Signatur-Update will freshclam ihn benachrichtigen, damit er die neuen Signaturen lädt. Eine dauerhafte Überwachung des ganzen Systems (Prüfung jeder Datei beim Zugriff) wäre ein zusätzlicher Baustein (`clamonacc`), der auf `clamd` aufbaut. Ich nutze stattdessen `clamscan`, das die Datenbank bei jedem Scan neu lädt.
- Das `user`-Modul zeigt bei `--diff` keinen Vorher-Nachher-Vergleich → stattdessen mit `getent passwd` und `id` auf dem Server geprüft.

---

## 08.10.2026 – Monitoring-Auswahl und Container-Plattform

### Was ich gemacht habe
- Monitoring-Lösungen verglichen (Zabbix, Prometheus + Grafana, Checkmk Community, Netdata, Monit, Uptime Kuma) und eine **Nutzwertanalyse** erstellt.
- Entscheidung für **Zabbix 7.0 LTS**: Checkmk und Zabbix lagen praktisch gleichauf (3,65 / 3,60). Den Ausschlag gaben Lernwert, der eingebaute SMTP-Client und der planbare LTS-Support.
- Geforderte Architektur analysiert (Reverse Proxy, Kong, Supabase, Mailserver, PostgreSQL, Object Storage).
- Docker, Podman und Kubernetes verglichen → **Docker** gewählt (Kompatibilität mit Supabase und Mailserver).
- Docker aus der offiziellen Paketquelle installiert, danach als `docker.yml`.
- **Experiment:** nachgewiesen, dass Docker ufw umgeht.

### Was ich gelernt habe
- Bei einer Nutzwertanalyse entscheidet oft die **Gewichtung**. Neue Anforderungen (z. B. Mailversand) können das Ergebnis verschieben.
- Monitoring auf dem überwachten Server kann einen Totalausfall nicht melden. Alarme sollten über ein **externes** Mailkonto laufen, nicht über den eigenen Mailserver.
- Weboberflächen nur an `127.0.0.1` binden und per **SSH-Tunnel** aufrufen (`ssh -L 8080:127.0.0.1:8080 …`).
- **Container sind keine VMs:** Sie teilen sich den Kernel des Hosts (Isolation über Namespaces und cgroups).
- **Gruppe `docker` = root-Rechte** → niemand kommt in diese Gruppe, Docker nur mit `sudo`.
- **Docker umgeht ufw:** Veröffentlichte Ports laufen durch die FORWARD-Kette, nicht durch INPUT. Schutz: nur Proxy und Mailserver veröffentlichen, alles andere nur in internen Docker-Netzwerken oder an `127.0.0.1`.
- Paketquellen werden über `Signed-By` an einen Schlüssel gebunden.
- Docker-Updates kommen nicht über unattended-upgrades, sondern über das manuelle `apt upgrade`.

### Experiment: Docker vs. ufw

| Test | Veröffentlichung | Von außen erreichbar? |
|---|---|---|
| 1 | `-p 8080:80` | **ja**, obwohl ufw nur Port 22 erlaubt |
| 2 | `-p 127.0.0.1:8080:80` | nein, nur über SSH-Tunnel |

Nebenbefund: Der Cloud-Anbieter hat keine eigene Firewall vor dem Server, ufw ist die einzige Firewall-Schicht.

### Probleme und Lösungen
- **`get_url` meldete im Probelauf `changed`**, obwohl der Schlüssel identisch war (Eigenheit im Check-Modus). Nachweis: echter Lauf mit `changed=0` und gleiche Prüfsumme (`sha256sum`) vor und nach dem Lauf.
- `mailcow` empfiehlt, ufw abzuschalten, und braucht mindestens 6 GiB RAM → passt schlecht zu meiner bisherigen Härtung. Stalwart läuft ohne Docker als systemd-Dienst.

---

## Was ich mir allgemein mitnehme
1. **Erst prüfen, dann ändern:** lesende Befehle (`ss`, `sshd -T`, `systemctl status`, `--check`) vor jeder Änderung.
2. **Erst von Hand, dann als Code:** So verstehe ich, was jeder Ansible-Task wirklich tut.
3. **Nachweise sammeln:** Logs, Probeläufe mit `changed=0` und Experimente sind stärker als „ist konfiguriert“.
4. **Sicherheitsnetz einplanen:** zweite SSH-Sitzung, Totmannschalter, `sshd -t` vor dem Neuladen.
5. **Entscheidungen begründen und dokumentieren**, auch bewusste Einschränkungen.
