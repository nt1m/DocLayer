scratchpad.modules.define("revisions", {
	html: '\
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js"></script>\
		<div noprint id="revisions-shell" class="sidebar themeable" hidden>\
    <div class="toolbar theme-main-color">\
        <button class="icon-button panel-close"><i class="icon-close"></i></button>\
        <span class="toolbar-label">Revisions</span>\
    </div>\
		<ul class="list" id="revisions-list">\
	</div>\
	',
	customhtml: '\
					<button title="View previous revisions" class="icon-button float-right" id="revisions-panel-button"><i class="icon-history"></i></button>\
	',
	getRevisionGroups: function (revisions) {
		var revisiongroups = [];
		var currentset = [];
		revisions.forEach(function (revision, index) {
			var previous = revisions[index - 1] || revision;

			var timefromprevious = Math.abs(revision.modifiedAt.getTime() - previous.modifiedAt.getTime());
			var revisionsingroup = currentset.length;
			var sizediff = Math.abs(revision.size - previous.size);

			if (timefromprevious < 12000 && revisionsingroup < 15 && sizediff < 500) {
				currentset.push(revision);
			} else {
				revisiongroups.push(currentset);
				currentset = [revision];
			}
		});
		revisiongroups.push(currentset);
		return revisiongroups;
	},
	restoreRevision: function (versionTag, time) {
		var _ = this;
		client.revertFile("/documents/" + document_id + ".html", versionTag, function (error, data) {
			if (error) {
				return createToast("Error restoring file.");
			}
			scratchpad.ui.sidebars.hide();
			if (time) {
				createToast("Restored to version from " + time);
			}
			refreshIfNeeded();
		});
	},
	loadRevisions: function () {
		var _ = this;
		client.history("/documents/" + document_id + ".html", {}, function (error, revisions) {
			if (error) {
				return _.revlist.html("Error loading revisions.");
			}
			_.revlist.html(""); //clear previous data

			var groups = _.getRevisionGroups(revisions);
			groups.forEach(function (group) {
				var revision = group[0];
				if (revision) {
					var item = $("<li ripple>");
					var time = moment(revision.modifiedAt).fromNow();
					var text = $("<span>").addClass("item-text").text(time);
					var secondarytext = $("<span>").addClass("secondary-text").text(revision.humanSize);
					var documenticon = $("<i>").addClass("icon-drive-file").addClass("item-action");
					var restoreicon = $("<i>").addClass("icon-history").addClass("item-action").addClass("item-restore-button").attr("title", "Restore this version").on("click", function () {
						_.restoreRevision(revision.versionTag, time);
					});
					secondarytext.appendTo(text);
					text.appendTo(item);
					documenticon.prependTo(item);
					restoreicon.appendTo(item);
					item.appendTo(_.revlist);
				}
			});
		});
	},
	init: function () {
		var _ = this;
		this.loadRevisions = this.loadRevisions.bind(this);
		this.restoreRevision = this.restoreRevision.bind(this);

		this.panel = $("#revisions-shell");
		this.revlist = $("#revisions-list");
		$(".editor-toolbar").append(this.customhtml);

		$("#revisions-panel-button").on("click", function () {
			scratchpad.ui.sidebars.show(_.panel);
			_.loadRevisions();
		});

	}
});