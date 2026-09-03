/* 05. How to join PCT.
   The section's one interaction, and it is not an animation: the printed
   schedule resolves against the clock. Events that have finished go quiet,
   the next one anybody can attend is marked, and once the last one has ended
   the whole list is replaced by a single line pointing at rush.html.

   Nothing here moves, fades, counts or reveals. The marks are applied once,
   before first paint in practice, and then they simply are.

   WITHOUT THIS FILE the markup is already correct: six events, six dates, six
   rooms, all readable, nothing hidden. This only adds "where are we now".
   Because it animates nothing, there is no teardown to register on
   window.pctMotion.onReduce.

   ---------------------------------------------------------------------------
   THE DATES BELOW ARE THE SECOND COPY. The first is the human-readable date
   printed in 05-howtojoin.html; both are transcribed from
   assets/rush-events.ics (DTSTART/DTEND, America/New_York, EDT = -04:00).
   All three must be changed together, and the owner still has to confirm the
   year: the .ics says 2026, the printed flyer said 2025. See the header
   comment in 05-howtojoin.html.
   --------------------------------------------------------------------------- */
window.pctInitJoin = function () {
  try {
    var root = document.querySelector('[data-join]');
    if (!root || root.dataset.joinReady === '1') return;

    var list = root.querySelector('[data-join-list]');
    var over = root.querySelector('[data-join-over]');
    if (!list) return;

    var rows = Array.prototype.slice.call(list.querySelectorAll('[data-join-ev]'));

    /* Index-matched to the six <li> in 05-howtojoin.html, in source order. */
    var EVENTS = [
      { start: '2026-09-02T19:00:00-04:00', end: '2026-09-02T21:00:00-04:00' },
      { start: '2026-09-04T19:00:00-04:00', end: '2026-09-04T21:00:00-04:00' },
      { start: '2026-09-09T19:00:00-04:00', end: '2026-09-09T21:00:00-04:00' },
      { start: '2026-09-11T19:00:00-04:00', end: '2026-09-11T21:00:00-04:00' },
      { start: '2026-09-16T19:00:00-04:00', end: '2026-09-16T21:00:00-04:00' },
      { start: '2026-09-18T19:00:00-04:00', end: '2026-09-18T21:00:00-04:00' }
    ];

    /* If the markup and this array have drifted apart, every mark below would
       land on the wrong event. Say nothing rather than lie about a date. */
    if (rows.length !== EVENTS.length) return;

    var now = Date.now();
    var ends = [];
    var i, t;
    for (i = 0; i < EVENTS.length; i++) {
      /* An event is past when it has ENDED, not when it has started: someone
         checking the page at 7:40 on a Wednesday can still walk in. */
      t = Date.parse(EVENTS[i].end);
      if (isNaN(t)) return;
      ends.push(t);
    }

    /* Resolve first, write second, so a bad date cannot leave half a list
       marked. `next` is the first event that has not ended, which means an
       event in progress right now is the one you are pointed at. */
    var past = [];
    var next = -1;
    for (i = 0; i < rows.length; i++) {
      var isPast = now >= ends[i];
      past.push(isPast);
      if (!isPast && next === -1) next = i;
    }

    root.dataset.joinReady = '1';

    if (next === -1) {
      /* Every event has ended. The list is now a list of things nobody can
         attend, so it is replaced rather than greyed out wholesale. */
      if (over) {
        over.hidden = false;
        list.hidden = true;
      }
      return;
    }

    for (i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (past[i]) {
        row.classList.add('is-past');
        /* Explicit, not decorative. A quieted row is still real information
           (it names a room a rushee may be asked about) and it stays in both
           the DOM and the accessibility tree. The visually hidden "Past" is
           what carries the state to a screen reader, since the only visual
           cue is a drop in contrast. */
        row.setAttribute('aria-hidden', 'false');
        var lab = row.querySelector('[data-join-past]');
        if (lab) lab.hidden = false;
      } else if (i === next) {
        row.classList.add('is-next');
        var mark = row.querySelector('[data-join-next]');
        if (mark) mark.hidden = false;
      }
    }
  } catch (err) {
    /* A wrong schedule is worse than an unresolved one: leave the printed
       markup exactly as authored. */
    if (window.console && console.warn) console.warn('pctInitJoin:', err);
  }
};
