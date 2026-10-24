// The demo can show any time of day, so the page needs a clock it can set.
// Load this before the card: it swaps in a Date that runs at normal speed
// from whatever time the page last chose.
(function () {
    const RealDate = Date;
    let offset = 0;

    class DemoDate extends RealDate {
        constructor(...args) {
            if (args.length) super(...args);
            else super(RealDate.now() + offset);
        }
        static now() {
            return RealDate.now() + offset;
        }
    }

    window.Date = DemoDate;
    window.awcDemoClock = {
        /** Make it hours:minutes today, local time, from now on. */
        set(hours, minutes) {
            const target = new RealDate();
            target.setHours(hours, minutes, 0, 0);
            offset = target.getTime() - RealDate.now();
        },
        /** The real time, whatever the page's clock says. */
        now() {
            return new RealDate();
        },
    };
})();
