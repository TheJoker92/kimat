from pySane.std_terminal import StdTerminal
from pySane.scan_image import ScanImage

image_scanner = ScanImage(StdTerminal())
print(image_scanner.enumerate_scanners())