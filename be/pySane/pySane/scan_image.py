"""
Module that wraps the functionality of the scan image
console application
"""

class ScanImage(object):
    """Wrapper for SANE ScanImage utility"""


    def __init__(self, terminal):
        super(ScanImage, self).__init__()
        self._terminal = terminal


    def enumerate_scanners(self):
        """
        List all of the scanners connection to the host machine.
        Returns a list of scanner names (strings)
        """

        scanners = []
        for rawLine in self._terminal.execute(["scanimage","-L"]):
            line = rawLine.decode('utf-8')
            if "No scanners were identified" in line:
                return []
            elif "'" in line:
                start = line.find("'")
                end = line.find("'", start + 1) - 1
                if end > start:
                    scanners.append(line[start:end])
        return scanners


    def preview(self, scanner):
        """
        """
        
        pass

    def scan(self, scanner, width=1700, height=2200, format="tiff"):
        pass
        