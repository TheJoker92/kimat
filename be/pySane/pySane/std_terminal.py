"""
Terminal that interacts with the system shell.
"""

#Imports
import subprocess
from .terminal_base import TerminalBase

class StdTerminal(TerminalBase):
    """Terminal that interacts with the system shell."""

    def __init__(self):
        super(StdTerminal, self).__init__()

    def execute(self, command):
        p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        while(True):
            
            retcode = p.poll() #returns None while subprocess is running
            
            line = p.stdout.readline()
            yield line

            if(retcode is not None):
                break